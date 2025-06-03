document.getElementById('handoverForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        livingSituation: document.getElementById('livingSituation').value,
        psychHistory: document.getElementById('psychHistory').value,
        followUp: document.getElementById('followUp').value,
        reason: document.getElementById('reason').value,
        method: document.getElementById('method').value,
        hospitalPresentation: document.getElementById('hospitalPresentation').value,
        impression: document.getElementById('impression').value,
        admitType: document.getElementById('admitType').value,
        certification: document.getElementById('certification').value,
        medication: document.getElementById('medication').value,
        collateral: document.getElementById('collateral').value,
        los: document.getElementById('los').value
    };

    // Generate summary
    const summary = `
        <h2>Patient Handover Summary</h2>
        <p><strong>Basic Information:</strong></p>
        <p>Age: ${formData.age}</p>
        <p>Gender: ${formData.gender}</p>
        <p>Living Situation: ${formData.livingSituation}</p>

        <p><strong>Psychiatric History:</strong></p>
        <p>History: ${formData.psychHistory}</p>
        <p>Follow-up: ${formData.followUp}</p>

        <p><strong>Presentation:</strong></p>
        <p>Reason: ${formData.reason}</p>
        <p>Method: ${formData.method}</p>
        <p>Hospital Presentation: ${formData.hospitalPresentation}</p>

        <p><strong>Assessment:</strong></p>
        <p>Impression: ${formData.impression}</p>
        <p>Admission Type: ${formData.admitType}</p>
        <p>Certification: ${formData.certification}</p>

        <p><strong>Treatment Plan:</strong></p>
        <p>Medication: ${formData.medication}</p>
        <p>Collateral Information: ${formData.collateral}</p>
        <p>Anticipated LOS: ${formData.los} days</p>
    `;

    // Display summary in a new window
    const summaryWindow = window.open('', '_blank');
    summaryWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Patient Summary</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { color: #333; }
                p { margin: 8px 0; }
                strong { color: #444; }
            </style>
        </head>
        <body>
            ${summary}
        </body>
        </html>
    `);

    // Print button
    summaryWindow.document.write(`
        <button onclick="window.print()" style="
            display: block;
            margin-top: 20px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        ">Print Summary</button>
    `);
});
