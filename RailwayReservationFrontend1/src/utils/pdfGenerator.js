import { jsPDF } from "jspdf";

/**
 * Generates and triggers download of Indian Railways E-Ticket PDF
 * @param {Object} booking - Booking details object
 * @param {Object} payment - Payment details object (optional)
 */
export function downloadTicketPdf(booking, payment) {
  if (!booking) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pnr = booking.pnrNumber || booking.pnr || "PNR12345678";
  const fare = booking.totalFare || booking.fare || 1;
  const status = booking.status || "CONFIRMED";
  const txnId = payment?.transactionId || ("RZP" + Math.floor(10000000 + Math.random() * 90000000));
  const payMethod = payment?.paymentMethod || "RAZORPAY TEST";

  // 1. Header Banner
  doc.setFillColor(30, 41, 59); // Slate-900 (#1e293b)
  doc.rect(0, 0, 210, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("INDIAN RAILWAYS - ELECTRONIC TICKET (E-TICKET)", 105, 14, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("RailReserve India Express Booking System", 105, 23, { align: "center" });

  // 2. PNR & Status Box
  doc.setFillColor(241, 245, 249); // Slate-100 (#f1f5f9)
  doc.rect(14, 38, 182, 22, "F");
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, 38, 182, 22, "S");

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("PNR NUMBER", 20, 46);
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.setFontSize(14);
  doc.text(pnr, 20, 54);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("BOOKING STATUS", 110, 46);
  doc.setTextColor(16, 185, 129); // Emerald-500
  doc.setFontSize(12);
  doc.text(`${status} / PAID`, 110, 54);

  // 3. Train & Journey Details Section
  doc.setFillColor(226, 232, 240);
  doc.rect(14, 68, 182, 8, "F");
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("JOURNEY & TRAIN DETAILS", 18, 73.5);

  let y = 84;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);

  doc.text("Train Name:", 20, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(String(booking.trainName || "Express Train"), 55, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Train Number:", 120, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("#" + String(booking.trainNumber || booking.trainId || "12951"), 155, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("From Station:", 20, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(String(booking.sourceStation || "Origin Station"), 55, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("To Station:", 120, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(String(booking.destinationStation || "Destination Station"), 155, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Date of Journey:", 20, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(String(booking.travelDate || booking.journeyDate || new Date().toISOString().split("T")[0]), 55, y);

  // 4. Passenger & Seat Details Section
  y += 14;
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y, 182, 8, "F");
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PASSENGER & SEAT DETAILS", 18, y + 5.5);

  y += 16;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);

  doc.text("Passenger Name:", 20, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(String(booking.passengerName || "Passenger"), 55, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Age / Gender:", 120, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${booking.passengerAge || 25} Yrs | ${booking.passengerGender || "MALE"}`, 155, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Travel Class:", 20, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text(String(booking.travelClass || booking.seatClass || "3AC"), 55, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Assigned Seat:", 120, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(79, 70, 229);
  doc.text(String(booking.seatNumber || "B1-12"), 155, y);

  // 5. Payment Details Section
  y += 14;
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y, 182, 8, "F");
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT & TRANSACTION SUMMARY", 18, y + 5.5);

  y += 16;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);

  doc.text("Total Fare Paid:", 20, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129);
  doc.text(`INR ${fare}.00`, 55, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Payment Mode:", 120, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(String(payMethod), 155, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Transaction ID:", 20, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(String(txnId), 55, y);

  // 6. Rules & Instructions
  y += 16;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, 196, y);

  y += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("IMPORTANT TRAVEL INSTRUCTIONS:", 14, y);

  y += 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);

  const instructions = [
    "1. Passengers must carry an original valid Photo ID (Aadhaar / Voter ID / Passport / Driving License) during travel.",
    "2. E-Ticket is non-transferable and valid only for the passenger name and schedule specified above.",
    "3. Ticket cancellation & refund policies are governed by Indian Railways passenger rules.",
    "4. 24x7 Railway Helpline: Dial 139.",
  ];

  instructions.forEach((inst) => {
    doc.text(inst, 14, y);
    y += 5.5;
  });

  // Footer Note
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on ${new Date().toLocaleString()} | RailReserve India System`, 105, y, { align: "center" });

  // 7. Save PDF File
  doc.save(`Ticket_${pnr}.pdf`);
}
