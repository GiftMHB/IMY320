/*
  Generates a simple, branded certificate PDF on the client using jsPDF.
  Used by course-complete.html and profile.html.
  Requires window.jspdf (loaded via the jsPDF UMD build in the host page).
*/

function studentDisplayName() {
  const user = JSON.parse(localStorage.getItem("codecampus_current_user") || "null");
  return user && user.name ? user.name : "Guest Learner";
}

function downloadCertificate(course, completedAt) {
  if (!window.jspdf) {
    showToast("Certificate unavailable", "Couldn't load the PDF engine — check your connection.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  const navy = "#041E42";
  const gold = "#C9A227";

  // border
  doc.setDrawColor(gold);
  doc.setLineWidth(3);
  doc.rect(24, 24, W - 48, H - 48);
  doc.setLineWidth(1);
  doc.rect(34, 34, W - 68, H - 68);

  doc.setTextColor(navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("CODECAMPUS", W / 2, 90, { align: "center" });

  doc.setFontSize(30);
  doc.text("Certificate of Completion", W / 2, 130, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor("#3A3F4B");
  doc.text("This certifies that", W / 2, 170, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(navy);
  doc.text(studentDisplayName(), W / 2, 205, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor("#3A3F4B");
  doc.text("has successfully completed", W / 2, 235, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(navy);
  const titleLines = doc.splitTextToSize(course.title, W - 200);
  doc.text(titleLines, W / 2, 265, { align: "center" });

  const dateStr = new Date(completedAt || Date.now()).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor("#3A3F4B");
  doc.text(`Completed on ${dateStr} · ${course.durationHours}h · ${course.category}`, W / 2, 300, {
    align: "center",
  });

  // gold seal
  doc.setFillColor(gold);
  doc.circle(W / 2, H - 90, 26, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CC", W / 2, H - 86, { align: "center" });

  doc.setTextColor(navy);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("codecampus — verified student achievement", W / 2, H - 45, { align: "center" });

  doc.save(`CodeCampus-Certificate-${course.id}.pdf`);
}
