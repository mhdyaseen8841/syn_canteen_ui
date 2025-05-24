import React, { useRef, useEffect } from 'react';

export default function CouponPrintComponent({ menuId, transactionId }) {
  const printRef = useRef();

  useEffect(() => {
    // Print directly when component mounts
    handlePrint();
  }, []);

  const handlePrint = () => {
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Write the print content to the iframe
    const contentWindow = iframe.contentWindow;
    contentWindow.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: monospace;
              font-size: 12px;
              text-align: center;
              margin: 0;
              padding: 10px;
            }
            .coupon {
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
              padding: 10px 0;
            }
            h2 {
              font-size: 16px;
              margin: 0 0 10px;
            }
          </style>
        </head>
        <body>
          <div class="coupon">
            <h2>CANTEEN COUPON</h2>
            <p><strong>Menu ID:</strong> ${menuId}</p>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
          </div>
        </body>
      </html>
    `);
    contentWindow.document.close();
    
    // Wait for content to load before printing
    contentWindow.onload = () => {
      contentWindow.focus();
      contentWindow.print();
      
      // Remove the iframe after printing (or after a timeout)
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
    };
  };

  return (
    <div>
      <div ref={printRef} style={{ display: 'none' }}>
        <div className="coupon">
          <h2>CANTEEN COUPON</h2>
          <p><strong>Menu ID:</strong> {menuId}</p>
          <p><strong>Transaction ID:</strong> {transactionId}</p>
        </div>
      </div>
      <button onClick={handlePrint}>Print Coupon</button>
    </div>
  );
}