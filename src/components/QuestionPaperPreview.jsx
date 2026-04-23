import { useRef, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, PageBreak, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { useNotification } from "@/context/NotificationContext";

function QuestionPaperPreview({ questions, paperName, totalMarks, onBack }) {
  const printRef = useRef(null);
  const { showSnackbar } = useNotification();

  // Load MathJax for mathematical equations
  useEffect(() => {
    // Load MathJax directly (no polyfill needed)
    if (!window.MathJax) {
      const mathJaxScript = document.createElement("script");
      mathJaxScript.id = "MathJax-script";
      mathJaxScript.async = true;
      mathJaxScript.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
      document.head.appendChild(mathJaxScript);
      
      return () => {
        if (mathJaxScript.parentNode) mathJaxScript.parentNode.removeChild(mathJaxScript);
      };
    }
  }, []);

  // Re-render MathJax when questions change
  useEffect(() => {
    if (window.MathJax && window.MathJax.typeset) {
      window.MathJax.typeset();
    }
    
    // Debug logging - helps diagnose options not showing
    console.group('QuestionPaperPreview Debug');
    console.log('Total questions:', questions.length);
    questions.forEach((q, idx) => {
      console.log(`Q${idx + 1}:`, {
        id: q.id,
        text: q.text?.substring(0, 40) + '...' || q.question_statement?.substring(0, 40) + '...',
        type: q.type,
        hasOptions: !!q.options,
        optionsArray: Array.isArray(q.options),
        optionsLength: q.options?.length || 0,
        firstOption: q.options?.[0]?.substring(0, 20)
      });
    });
    console.groupEnd();
  }, [questions]);

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=900,height=1200");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${paperName}</title>
        <style>
          :root {
            --blue-dark: #0a2a6e;
            --blue-mid: #1a4da0;
            --blue-light: #dce8f8;
            --gold: #c8950a;
            --gold-light: #fdf3d6;
            --red: #c0392b;
            --green: #1a7a3a;
            --text: #1a1a1a;
            --muted: #555;
            --border: #b0bed4;
            --bg: #f5f7fa;
            --white: #ffffff;
            --section-bg: #eaf0fa;
          }

          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Georgia', serif; background: var(--bg); color: var(--text); font-size: 13px; line-height: 1.5; }
          @media print {
            body { background: white; margin: 0; padding: 0; }
            .page { 
              box-shadow: none; 
              margin: 0; 
              border: none;
              width: 210mm;
              height: 297mm;
              padding: 12mm;
            }
            .question-card { page-break-inside: avoid; }
          }
          
          .header { background: var(--blue-dark); color: white; padding: 16px 28px; border-bottom: 2px solid var(--gold); }
          .header h1 { font-size: 20px; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.5px; }
          .header p { font-size: 12px; color: rgba(255,255,255,0.75); }

          .info-section { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; background: var(--blue-mid); color: white; font-size: 12px; }
          .info-item { padding: 10px 16px; border-right: 1px solid rgba(255,255,255,0.15); text-align: center; }
          .info-item:last-child { border-right: none; }
          .info-label { color: rgba(255,255,255,0.7); font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; }
          .info-value { font-weight: 600; font-size: 13px; margin-top: 4px; }

          .instructions { background: var(--gold-light); border: 1px solid #e8c96b; border-left: 4px solid var(--gold); margin: 20px 24px; padding: 14px 18px; border-radius: 2px; font-size: 12px; }
          .instructions h3 { color: var(--gold); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 8px; }
          .instructions ol { padding-left: 18px; }
          .instructions li { margin-bottom: 5px; color: #4a3800; }

          .section-header { background: var(--blue-dark); color: white; padding: 10px 24px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; display: flex; justify-content: space-between; margin-top: 8px; }
          .section-header .info { font-size: 10px; color: rgba(255,255,255,0.7); font-weight: 400; }

          .questions-wrap { padding: 0 24px 24px; }

          .question-card { border: 1px solid var(--border); border-radius: 4px; margin-top: 12px; overflow: hidden; page-break-inside: avoid; }
          .q-header { background: var(--section-bg); padding: 8px 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
          .q-num { font-weight: 700; font-size: 12px; color: var(--blue-dark); }
          .q-tag { font-size: 10px; background: var(--blue-mid); color: white; padding: 2px 8px; border-radius: 12px; font-weight: 500; }

          .q-body { padding: 12px 14px; }
          .q-text { font-size: 13px; line-height: 1.6; color: var(--text); margin-bottom: 10px; }
          .q-marks { font-size: 11px; color: var(--muted); margin-bottom: 10px; display: block; }

          .options { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .option { display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px; border: 1px solid var(--border); border-radius: 4px; user-select: none; }
          .opt-label { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--blue-mid); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: var(--blue-mid); flex-shrink: 0; }
          .opt-text { font-size: 12px; line-height: 1.4; }

          .blank-space { display: block; height: 60px; border: 1px dashed var(--border); border-radius: 4px; padding: 5px; background: #fafafa; margin-top: 8px; }

          .footer { border-top: 1px solid var(--border); padding: 12px 24px; text-align: center; font-size: 11px; color: var(--muted); background: #fafbfd; }

          @media print { .page { box-shadow: none; margin: 0; border: none; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <h1>${paperName}</h1>
            <p>Question Practice Paper</p>
          </div>
          
          <div class="info-section">
            <div class="info-item">
              <div class="info-label">Total Questions</div>
              <div class="info-value">${questions.length}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Total Marks</div>
              <div class="info-value">${totalMarks}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Date</div>
              <div class="info-value">${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div class="instructions">
            <h3>✓ Instructions</h3>
            <ol>
              <li>Each question is worth the marks mentioned beside it.</li>
              <li>Attempt all questions.</li>
              <li>For MCQs, select the most appropriate option.</li>
              <li>Show all working in your answer script.</li>
            </ol>
          </div>

          <div class="section-header">
            QUESTIONS
            <span class="info">${questions.length} Questions • ${totalMarks} Marks</span>
          </div>

          <div class="questions-wrap">
            ${questions
              .map(
                (q, idx) => `
                <div class="question-card">
                  <div class="q-header">
                    <span class="q-num">Q. ${idx + 1}</span>
                    <span class="q-tag">${q.type === "mcq" ? "MCQ" : "Answer"}</span>
                  </div>
                  <div class="q-body">
                    <div class="q-text">${q.text || q.question_statement || ""}</div>
                    <div class="q-marks">
                      Marks: <strong>${q.marks || 1}</strong>
                    </div>
                    ${
                      q.type === "mcq" && q.options && Array.isArray(q.options) && q.options.length > 0
                        ? `
                        <div class="options">
                          ${q.options
                            .map(
                              (opt, i) => `
                            <div class="option">
                              <div class="opt-label">${String.fromCharCode(65 + i)}</div>
                              <div class="opt-text">${opt || ""}</div>
                            </div>
                          `
                            )
                            .join("")}
                        </div>
                      `
                        : `<span class="blank-space"></span>`
                    }
                  </div>
                </div>
              `
              )
              .join("")}
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const doc = printRef.current.innerHTML;
    const link = document.createElement("a");
    const blob = new Blob([doc], { type: "text/html" });
    link.href = URL.createObjectURL(blob);
    link.download = `${paperName.replace(/\s+/g, "_")}.html`;
    link.click();
  };

  const handleDownloadPDF = async () => {
    try {
      // Create professional HTML with JEE-like styling
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${paperName}</title>
          <style>
            :root {
              --blue-dark: #0a2a6e;
              --blue-mid: #1a4da0;
              --blue-light: #dce8f8;
              --gold: #c8950a;
              --gold-light: #fdf3d6;
              --red: #c0392b;
              --green: #1a7a3a;
              --text: #1a1a1a;
              --muted: #555;
              --border: #b0bed4;
              --bg: #f5f7fa;
              --white: #ffffff;
              --section-bg: #eaf0fa;
            }

            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: 100%; height: 100%; }
            body { font-family: Georgia, serif; line-height: 1.5; color: var(--text); background: white; }
            .container { 
              width: 210mm; 
              height: 297mm;
              margin: 0 auto; 
              padding: 12mm;
              background: white; 
              box-sizing: border-box;
            }
            
            @media print {
              .container { width: 210mm; height: 297mm; padding: 12mm; margin: 0; }
            }
            
            .header { background: var(--blue-dark); color: white; padding: 16px 28px; border-bottom: 2px solid var(--gold); }
            .header h1 { font-size: 20px; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.5px; }
            .header p { font-size: 12px; color: rgba(255,255,255,0.75); }

            .info-section { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; background: var(--blue-mid); color: white; font-size: 12px; }
            .info-item { padding: 10px 16px; border-right: 1px solid rgba(255,255,255,0.15); text-align: center; }
            .info-item:last-child { border-right: none; }
            .info-label { color: rgba(255,255,255,0.7); font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; }
            .info-value { font-weight: 600; font-size: 13px; margin-top: 4px; }

            .instructions { background: var(--gold-light); border: 1px solid #e8c96b; border-left: 4px solid var(--gold); margin: 20px 24px; padding: 14px 18px; border-radius: 2px; font-size: 12px; }
            .instructions h3 { color: var(--gold); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 8px; }
            .instructions ol { padding-left: 18px; }
            .instructions li { margin-bottom: 5px; color: #4a3800; }

            .section-header { background: var(--blue-dark); color: white; padding: 10px 24px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; display: flex; justify-content: space-between; margin-top: 8px; }
            .section-header .info { font-size: 10px; color: rgba(255,255,255,0.7); font-weight: 400; }

            .questions-wrap { padding: 0 24px 24px; }

            .question-card { border: 1px solid var(--border); border-radius: 4px; margin-top: 12px; overflow: hidden; page-break-inside: avoid; }
            .q-header { background: var(--section-bg); padding: 8px 14px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
            .q-num { font-weight: 700; font-size: 12px; color: var(--blue-dark); }
            .q-tag { font-size: 10px; background: var(--blue-mid); color: white; padding: 2px 8px; border-radius: 12px; font-weight: 500; }

            .q-body { padding: 12px 14px; }
            .q-text { font-size: 13px; line-height: 1.6; color: var(--text); margin-bottom: 10px; }
            .q-marks { font-size: 11px; color: var(--muted); margin-bottom: 10px; display: block; }

            .options { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .option { display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px; border: 1px solid var(--border); border-radius: 4px; }
            .opt-label { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--blue-mid); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: var(--blue-mid); flex-shrink: 0; }
            .opt-text { font-size: 12px; line-height: 1.4; }

            .blank-space { display: block; height: 60px; border: 1px dashed var(--border); border-radius: 4px; padding: 5px; background: #fafafa; margin-top: 8px; }

            .footer { border-top: 1px solid var(--border); padding: 12px 24px; text-align: center; font-size: 11px; color: var(--muted); background: #fafbfd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${paperName}</h1>
              <p>Question Practice Paper</p>
            </div>
            
            <div class="info-section">
              <div class="info-item">
                <div class="info-label">Total Questions</div>
                <div class="info-value">${questions.length}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Total Marks</div>
                <div class="info-value">${totalMarks}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Date</div>
                <div class="info-value">${new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div class="instructions">
              <h3>✓ Instructions</h3>
              <ol>
                <li>Each question is worth the marks mentioned beside it.</li>
                <li>Attempt all questions.</li>
                <li>For MCQs, select the most appropriate option.</li>
                <li>Show all working in your answer script.</li>
              </ol>
            </div>

            <div class="section-header">
              QUESTIONS
              <span class="info">${questions.length} Questions • ${totalMarks} Marks</span>
            </div>

            <div class="questions-wrap">
              ${questions
                .map(
                  (q, idx) => `
                  <div class="question-card">
                    <div class="q-header">
                      <span class="q-num">Q. ${idx + 1}</span>
                      <span class="q-tag">${q.type === "mcq" ? "MCQ" : "Answer"}</span>
                    </div>
                    <div class="q-body">
                      <div class="q-text">${q.text || q.question_statement || ""}</div>
                      <div class="q-marks">
                        Marks: <strong>${q.marks || 1}</strong>
                      </div>
                      ${
                        q.type === "mcq" && q.options && Array.isArray(q.options) && q.options.length > 0
                          ? `
                          <div class="options">
                            ${q.options
                              .map(
                                (opt, i) => `
                              <div class="option">
                                <div class="opt-label">${String.fromCharCode(65 + i)}</div>
                                <div class="opt-text">${opt || ""}</div>
                              </div>
                            `
                              )
                              .join("")}
                          </div>
                        `
                          : `<span class="blank-space"></span>`
                      }
                    </div>
                  </div>
                `
                )
                .join("")}
            </div>

            <div class="footer">
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create a temporary div and render HTML with proper sizing
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      tempDiv.style.width = "210mm";
      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Render with html2canvas using proper width
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        logging: false,
        backgroundColor: "#ffffff",
        width: 794, // 210mm at 96dpi
        windowHeight: tempDiv.scrollHeight,
      });

      // Remove temp div
      document.body.removeChild(tempDiv);

      // Convert to PDF with proper width
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${paperName.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF download error:", error);
      showSnackbar("Error generating PDF. Using browser print instead.", "warning");
      handlePrint();
    }
  };

  const handleDownloadWord = () => {
    const sections = [];

    // Header
    sections.push(
      new Paragraph({
        text: paperName,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        style: "Heading1",
      })
    );

    sections.push(
      new Paragraph({
        text: "JEE MAINS PRACTICE PAPER",
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        style: "Heading2",
      })
    );

    // Info
    sections.push(
      new Table({
        width: { size: 100, type: "pct" },
        rows: [
          new TableRow({
            cells: [
              new TableCell({ children: [new Paragraph("Total Questions")] }),
              new TableCell({ children: [new Paragraph(questions.length.toString())] }),
              new TableCell({ children: [new Paragraph("Total Marks")] }),
              new TableCell({ children: [new Paragraph(totalMarks.toString())] }),
            ],
          }),
        ],
      })
    );

    sections.push(new Paragraph({ text: "", spacing: { after: 200 } }));

    // Instructions
    sections.push(
      new Paragraph({
        text: "Instructions:",
        style: "Heading2",
        spacing: { after: 100 },
      })
    );

    sections.push(
      new Paragraph({
        text: "1. Each question is worth the marks mentioned beside it.\n2. Attempt all questions.\n3. For MCQs, select the most appropriate option.\n4. Show all working in your answer script.",
        spacing: { after: 200 },
      })
    );

    // Questions
    questions.forEach((q, idx) => {
      sections.push(
        new Paragraph({
          text: `Q${idx + 1}. ${q.text}`,
          spacing: { before: 100, after: 50 },
          style: "Heading3",
        })
      );

      sections.push(
        new Paragraph({
          text: `Marks: ${q.marks || 1}`,
          spacing: { after: 100 },
          style: "Normal",
        })
      );

      // MCQ Options
      if (q.type === "mcq" && q.options?.length > 0) {
        q.options.forEach((opt, i) => {
          sections.push(
            new Paragraph({
              text: `(${String.fromCharCode(65 + i)}) ${opt}`,
              spacing: { after: 50 },
              indent: { left: 720 },
            })
          );
        });
      } else {
        sections.push(
          new Paragraph({
            text: "[Space for answer]",
            spacing: { after: 100 },
            indent: { left: 720 },
          })
        );
      }
    });

    const doc = new Document({
      sections: [
        {
          children: sections,
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${paperName.replace(/\s+/g, "_")}.docx`);
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-(--color-bg-tertiary) rounded-lg transition-colors"
          title="Go back"
        >
          <ArrowBackIcon />
        </button>
        <div className="flex-1">
          <h1 className="theme-heading text-2xl font-bold">{paperName} - Preview</h1>
          <p className="theme-text-muted text-sm">
            {questions.length} questions • {totalMarks} marks
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="theme-btn-primary flex items-center gap-2 px-4 py-2.5 text-sm"
          >
            <PrintIcon fontSize="small" /> Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg bg-(--color-bg-secondary) theme-text-secondary hover:bg-(--color-bg-tertiary) transition-colors"
          >
            <DownloadIcon fontSize="small" /> PDF
          </button>
          <button
            onClick={handleDownloadWord}
            className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg bg-(--color-bg-secondary) theme-text-secondary hover:bg-(--color-bg-tertiary) transition-colors"
          >
            <DownloadIcon fontSize="small" /> Word
          </button>
        </div>
      </div>

      {/* Paper Preview - A4 Standard (210mm × 297mm) */}
      <div
        ref={printRef}
        className="mx-auto bg-white rounded-lg shadow-lg"
        style={{ 
          border: "1px solid #b0bed4",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          color: "#1a1a1a",
          backgroundColor: "#fff",
          overflow: "hidden",
          maxWidth: "calc(210mm + 4px)",
          width: "100%",
          aspectRatio: "210 / 297"
        }}
      >
        {/* Header */}
        <div style={{
          backgroundColor: "#0a2a6e",
          color: "white",
          padding: "16px 28px",
          borderBottom: "2px solid #c8950a"
        }}>
          <h1 style={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "4px",
            letterSpacing: "0.5px",
            fontFamily: "Georgia, serif"
          }}>
            {paperName}
          </h1>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", margin: 0 }}>
            Question Practice Paper
          </p>
        </div>

        {/* Info Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0",
          backgroundColor: "#1a4da0",
          color: "white",
          fontSize: "12px"
        }}>
          <div style={{ padding: "10px 16px", borderRight: "1px solid rgba(255,255,255,0.15)", textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Total Questions
            </div>
            <div style={{ fontWeight: "600", fontSize: "13px", marginTop: "4px" }}>
              {questions.length}
            </div>
          </div>
          <div style={{ padding: "10px 16px", borderRight: "1px solid rgba(255,255,255,0.15)", textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Total Marks
            </div>
            <div style={{ fontWeight: "600", fontSize: "13px", marginTop: "4px" }}>
              {totalMarks}
            </div>
          </div>
          <div style={{ padding: "10px 16px", textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Date
            </div>
            <div style={{ fontWeight: "600", fontSize: "13px", marginTop: "4px" }}>
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          backgroundColor: "#fdf3d6",
          border: "1px solid #e8c96b",
          borderLeft: "4px solid #c8950a",
          margin: "20px 24px",
          padding: "14px 18px",
          borderRadius: "2px",
          fontSize: "12px"
        }}>
          <h3 style={{
            color: "#c8950a",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontWeight: "700",
            marginBottom: "8px",
            fontFamily: "Arial, sans-serif"
          }}>
            ✓ Instructions
          </h3>
          <ol style={{ paddingLeft: "18px", margin: 0 }}>
            <li style={{ marginBottom: "5px", color: "#4a3800" }}>Each question is worth the marks mentioned beside it.</li>
            <li style={{ marginBottom: "5px", color: "#4a3800" }}>Attempt all questions.</li>
            <li style={{ marginBottom: "5px", color: "#4a3800" }}>For MCQs, select the most appropriate option.</li>
            <li style={{ color: "#4a3800" }}>Show all working in your answer script.</li>
          </ol>
        </div>

        {/* Section Header */}
        <div style={{
          backgroundColor: "#0a2a6e",
          color: "white",
          padding: "10px 24px",
          fontSize: "12px",
          fontWeight: "600",
          letterSpacing: "0.5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "8px"
        }}>
          <span>QUESTIONS</span>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", fontWeight: "400" }}>
            {questions.length} Questions • {totalMarks} Marks
          </span>
        </div>

        {/* Questions */}
        <div style={{ padding: "0 24px 24px" }}>
          {questions && questions.length > 0 ? (
            questions.map((question, idx) => {
              return (
                <div
                  key={question.id || idx}
                  style={{
                    border: "1px solid #b0bed4",
                    borderRadius: "4px",
                    marginTop: "12px",
                    overflow: "hidden",
                    pageBreakInside: "avoid"
                  }}
                >
                  {/* Question Header */}
                  <div style={{
                    backgroundColor: "#eaf0fa",
                    padding: "8px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #b0bed4"
                  }}>
                    <span style={{
                      fontWeight: "700",
                      fontSize: "12px",
                      color: "#0a2a6e"
                    }}>
                      Q. {idx + 1}
                    </span>
                    <span style={{
                      fontSize: "10px",
                      backgroundColor: "#1a4da0",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontWeight: "500"
                    }}>
                      {question.type === "mcq" ? "MCQ" : "Answer"}
                    </span>
                  </div>

                  {/* Question Body */}
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{
                      fontSize: "13px",
                      lineHeight: "1.6",
                      color: "#1a1a1a",
                      marginBottom: "10px",
                      fontFamily: "Georgia, serif"
                    }}>
                      {question.text || question.question_statement}
                    </div>

                    <div style={{
                      fontSize: "11px",
                      color: "#555",
                      marginBottom: "10px",
                      display: "block"
                    }}>
                      Marks: <strong>{question.marks || 1}</strong>
                    </div>

                    {/* Options for MCQ */}
                    {question.type === "mcq" && question.options && Array.isArray(question.options) && question.options.length > 0 ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {question.options.map((option, i) => (
                          option && option.trim() && (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "10px",
                                padding: "8px 10px",
                                border: "1px solid #b0bed4",
                                borderRadius: "4px"
                              }}
                            >
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  border: "1.5px solid #1a4da0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "10px",
                                  fontWeight: "700",
                                  color: "#1a4da0",
                                  flexShrink: 0
                                }}
                              >
                                {String.fromCharCode(65 + i)}
                              </div>
                              <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                                {option}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "block",
                          height: "60px",
                          border: "1px dashed #b0bed4",
                          borderRadius: "4px",
                          padding: "5px",
                          backgroundColor: "#fafafa",
                          marginTop: "8px"
                        }}
                      ></div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: "#999", textAlign: "center" }}>No questions to display</p>
          )}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid #b0bed4",
          padding: "12px 24px",
          textAlign: "center",
          fontSize: "11px",
          color: "#555",
          backgroundColor: "#fafbfd"
        }}>
          <p>Generated on {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default QuestionPaperPreview;
