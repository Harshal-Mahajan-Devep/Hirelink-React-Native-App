export const getReceiptHTML = (payment = {}) => {
  const roleLower = (payment.role || '').toLowerCase();

  const paymentForText =
    payment.paymentFor ||
    (roleLower === 'candidate'
      ? 'Candidate Signup Fee'
      : roleLower === 'employer'
      ? 'Employer Signup Fee'
      : roleLower === 'employer_staff'
      ? 'Extended Staff Fee'
      : roleLower === 'resume_download'
      ? 'Resume Download Fee'
      : 'Payment');

  const mobile = String(payment.mobile || '');
  const last4 = mobile.slice(-4);

  const amount = Number(String(payment.amount || 0).replace(/[^\d.]/g, ''));

  const gstRate = 18;
  const baseAmount = +((amount * 100) / (100 + gstRate)).toFixed(2);
  const gstAmount = +(amount - baseAmount).toFixed(2);

  const dateObj = payment.date ? new Date(payment.date) : new Date();

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  const receiptNo = `HRLK-${last4}-${amount}-${day}${month}${year}`;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Hirelink Receipt</title>

<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: #ffffff;
    padding: 24px;
    color: #111;
  }

  .hl-rec-wrapper {
    max-width: 820px;
    margin: auto;
    border: 1px solid #e5e7eb;
    padding: 24px;
  }

  /* HEADER */
  .hl-rec-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 16px;
  }

  .hl-rec-company img {
    height: 46px;
  }

  .hl-rec-title {
    font-size: 18px;
    font-weight: 800;
    text-align: right;
    color: #0f5132;
  }

  /* BILLING */
  .hl-rec-billing {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    font-size: 14px;
  }

  .hl-rec-label {
    font-weight: 800;
    margin-bottom: 6px;
    color: #0f5132;
  }

  .hl-rec-right {
    text-align: right;
  }

  /* TABLE */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 24px;
    font-size: 14px;
  }

  thead th {
    background: #0f5132;
    color: #ffffff;
    padding: 10px;
    text-align: left;
  }

  thead th.r {
    text-align: right;
  }

  tbody td {
    padding: 10px;
    border-bottom: 1px solid #e5e7eb;
  }

  tbody td.r {
    text-align: right;
  }

  /* TOTAL */
  .hl-rec-total-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .hl-rec-total-box .row {
    width: 280px;
    background: #f0fdf4;
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 800;
    display: flex;
    justify-content: space-between;
    border-top: 2px solid #0f5132;
  }

  /* NOTES */
  .hl-rec-notes {
    margin-top: 20px;
    font-size: 13px;
    color: #374151;
  }

  .receipt-text {
    margin-left: 6px;
  }
</style>
</head>

<body>
  <div class="hl-rec-wrapper">

    <!-- HEADER -->
    <div class="hl-rec-header">
      <div class="hl-rec-company">
        <img src="https://hirelink.in/logo.png" alt="Hirelink" />
      </div>

      <div>
        <div class="hl-rec-title">RECEIPT</div>
        <div style="font-size:14px">#${receiptNo}</div>
      </div>
    </div>

    <!-- BILLING -->
    <div class="hl-rec-billing">
      <div>
        <div class="hl-rec-label">Billed To</div>
        <div><b>Name:</b> ${payment.name || '-'}</div>
        <div><b>Email:</b> ${payment.email || '-'}</div>
        <div><b>Mobile:</b> ${payment.mobile || '-'}</div>
        <div><b>Order ID:</b> ${payment.orderId || '-'}</div>
        <div><b>Payment ID:</b> ${payment.paymentId || '-'}</div>
      </div>

      <div class="hl-rec-right">
        <div class="hl-rec-label">Date</div>
        <div>${dateObj.toLocaleString()}</div>
      </div>
    </div>

    <!-- TABLE -->
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="r">Amount</th>
          <th class="r">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${paymentForText}</td>
          <td class="r">${baseAmount}</td>
          <td class="r">${baseAmount}</td>
        </tr>
        <tr>
          <td>GST (18%)</td>
          <td class="r">${gstAmount}</td>
          <td class="r">${gstAmount}</td>
        </tr>
      </tbody>
    </table>

    <!-- TOTAL -->
    <div class="hl-rec-total-box">
      <div class="row">
        <span>Total</span>
        <span>${amount}</span>
      </div>
    </div>

    <!-- NOTES -->
    <div class="hl-rec-notes">
      <b>Notes:</b>
      <span class="receipt-text">
        This receipt confirms successful payment on Pharma Jobs.
        Payment is non-refundable.
      </span>
    </div>

  </div>
</body>
</html>
`;
};
