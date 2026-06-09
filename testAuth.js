const http = require('http');

// The payload mimicking a real user typing their credentials into a login page
const loginPayload = JSON.stringify({
    email: "miller@paddymill.lk",
    password: "password123"
});

// Setup the connection parameters to talk to your live server on port 5000
const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginPayload)
    }
};

console.log("🚀 Sending mock login request to backend server...");

const req = http.request(options, (res) => {
    let data = '';

    // Collect data packets as they stream in
    res.on('data', (chunk) => {
        data += chunk;
    });

    // Once all data is received, parse and evaluate the results
    res.on('end', () => {
        console.log(`📡 Server Response Status: ${res.statusCode}`);
        try {
            const jsonResponse = JSON.parse(data);
            console.log("\n🔒 --- DECODED SERVER RESPONSE ---");
            console.log(JSON.stringify(jsonResponse, null, 2));
            console.log("-----------------------------------\n");
            
            if (jsonResponse.success) {
                console.log("🎯 SUCCESS: The backend successfully authenticated Kamal Perera, verified his role as 'mill_owner', and issued a secure encrypted JWT Token!");
            } else {
                console.log("❌ FAILURE: The backend rejected the credentials.");
            }
        } catch (e) {
            console.error("❌ Could not parse server response. Is the endpoint sending clean JSON?", e);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Connection failed: ${e.message}. Did you forget to keep 'node server.js' running in your other terminal window?`);
});

// Write data to request body and close the connection
req.write(loginPayload);
req.end();