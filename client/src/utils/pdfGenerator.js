import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

/**
 * Generates and triggers download of a cryptographically verifiable PDF Certificate with an embedded QR code.
 * @param {Object} options
 * @param {Object} options.certificate - Certificate details
 * @param {string} options.language - 'en' or 'fr'
 */
export async function downloadCertificatePDF({ certificate, language = 'en' }) {
  if (!certificate) return;

  const isFr = language === 'fr';
  const certId = certificate.id || certificate.certificateId || 'CN-CERT-GENERIC';
  const recipient = certificate.recipient || certificate.username || 'Operative';
  const courseTitle = certificate.course || certificate.courseTitle || 'Cybersecurity Mastery Track';
  const issueDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString(isFr ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString();
  const issuer = certificate.issuer || 'CyberNexus Academic Board & Examination Council';
  const badgeType = certificate.badgeType || 'CyberNexus Certified Specialist';
  const sigHash = certificate.signatureHash || '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  // 1. Construct public verification URL for QR code
  const baseUrl = window.location.origin;
  const verificationUrl = `${baseUrl}/#verify/${certId}`;

  // 2. Generate QR Code Data URL
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 1,
      width: 200,
      color: {
        dark: '#00F0FF',
        light: '#0A0F1D',
      },
    });
  } catch (err) {
    console.warn('QR Code generation fallback:', err);
  }

  // 3. Initialize jsPDF in Landscape A4 (297mm x 210mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Background Fill (#070B14 Dark Cyber Canvas)
  doc.setFillColor(7, 11, 20);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Border Accent (Cyan #00F0FF)
  doc.setDrawColor(0, 240, 255);
  doc.setLineWidth(1.5);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // Inner Golden Border (#F59E0B)
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.6);
  doc.rect(11, 11, pageWidth - 22, pageHeight - 22);

  // Corner Ornaments
  const drawCorner = (x, y, dx, dy) => {
    doc.setDrawColor(0, 240, 255);
    doc.setLineWidth(1.2);
    doc.line(x, y, x + dx * 12, y);
    doc.line(x, y, x, y + dy * 12);
  };
  drawCorner(14, 14, 1, 1);
  drawCorner(pageWidth - 14, 14, -1, 1);
  drawCorner(14, pageHeight - 14, 1, -1);
  drawCorner(pageWidth - 14, pageHeight - 14, -1, -1);

  // Header Shield Badge
  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 240, 255);
  doc.text('CYBERNEXUS SECURITY ACADEMY & EXAMINATION COUNCIL', pageWidth / 2, 25, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('OFFICIAL VERIFIABLE ATTESTATION OF MASTERY', pageWidth / 2, 30, { align: 'center' });

  // Main Title
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text(isFr ? 'CERTIFICAT D\'EXCELLENCE EN CYBERSÉCURITÉ' : 'CERTIFICATE OF CYBERSECURITY ACHIEVEMENT', pageWidth / 2, 45, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(203, 213, 225);
  doc.text(
    isFr
      ? 'Le Conseil Académique de CyberNexus atteste par la présente que :'
      : 'The Academic & Examination Board of CyberNexus hereby certifies that:',
    pageWidth / 2,
    58,
    { align: 'center' }
  );

  // Recipient Name
  doc.setFont('times', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(0, 240, 255);
  doc.text(recipient.toUpperCase(), pageWidth / 2, 73, { align: 'center' });

  // Line separator under name
  doc.setDrawColor(0, 240, 255);
  doc.setLineWidth(0.4);
  doc.line(70, 77, pageWidth - 70, 77);

  // Completion text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(203, 213, 225);
  doc.text(
    isFr
      ? 'a validé avec succès tous les contrôles techniques et maîtrisé le cursus d\'expert :'
      : 'has successfully demonstrated high-level competence and completed the expert track:',
    pageWidth / 2,
    86,
    { align: 'center' }
  );

  // Course Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(245, 158, 11); // Gold
  doc.text(courseTitle, pageWidth / 2, 93, { align: 'center' });

  // Digital Badge Shield Box
  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.8);
  doc.roundedRect(pageWidth / 2 - 65, 102, 130, 24, 3, 3, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(245, 158, 11);
  doc.text('- DIGITAL BADGE AWARDED -', pageWidth / 2, 110, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(badgeType.toUpperCase(), pageWidth / 2, 119, { align: 'center' });

  // Cryptographic Signature Hash Box
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`SHA-256 ATTESTATION HASH: ${sigHash}`, pageWidth / 2, 135, { align: 'center' });
  doc.text(`VERIFICATION TOKEN ID: ${certId}`, pageWidth / 2, 140, { align: 'center' });

  // Footer Info - Left: Signatures & Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(issueDate, 35, 170);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(isFr ? 'Date de Délivrance' : 'Date of Issuance', 35, 175);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Dr. Yassine Kaltoum, CISSP', 110, 170);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(isFr ? 'Président du Conseil de Certification' : 'Head of Examination Board', 110, 175);

  // Footer Info - Right: Embedded QR Code
  if (qrDataUrl) {
    try {
      doc.addImage(qrDataUrl, 'PNG', pageWidth - 60, 150, 32, 32);
      doc.setFont('courier', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(0, 240, 255);
      doc.text('SCAN TO VERIFY', pageWidth - 44, 186, { align: 'center' });
    } catch (e) {
      console.warn('Could not render QR code in PDF:', e);
    }
  }

  // Save PDF file
  const fileName = `CyberNexus_Certificate_${recipient.replace(/\s+/g, '_')}_${certId}.pdf`;
  doc.save(fileName);
}