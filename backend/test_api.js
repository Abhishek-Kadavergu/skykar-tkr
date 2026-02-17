import fetch from 'node-fetch';

const testApi = async () => {
    const payload = {
        uid: 'test-user-123',
        name: 'Test User',
        email: 'test@example.com',
        preferences: [
            { category: 'Shoes', brands: ['Nike'], budget: 5000 }
        ]
    };

    try {
        const response = await fetch('http://localhost:5000/api/user-preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.status === 201) {
            console.log('SUCCESS: Preference saved');
            const data = await response.json();
            console.log(data);
        } else {
            console.log('FAILED: Status', response.status);
            const text = await response.text();
            console.log(text);
        }
    } catch (error) {
        console.error('ERROR:', error);
    }
};

testApi();
