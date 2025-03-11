import { test, expect, request as playwrightRequest } from '@playwright/test';

let apiContext

const TEST_DATA = {
    auth: {
        username: 'admin',
        password: 'password123'
    },
    booking: {
        id: 237,
        expectedData: {
            firstname: "John",
            lastname: "Smith"
        }
    }
};

test.beforeAll(" Loading URL", async() => {
    apiContext = await playwrightRequest.newContext({
        baseURL: "https://restful-booker.herokuapp.com"
    });
})

// Add proper cleanup
test.afterAll(async () => {
    await apiContext.dispose();
});

test.describe('Booking API Tests', () => {

    test("Should get all bookings", async () => {
        const response = await apiContext.get("/booking");
        
        expect(response.status()).toBe(200);
        
        try {
            const responseBody = await response.json();
            expect(responseBody).toBeTruthy();
        } catch (error) {
            console.error('Failed to parse response:', await response.text());
            throw error;
        }
    });

    test("Should create auth token with valid credentials", async () => {
        const response = await apiContext.post(`/auth`, {
            data: {
                username: TEST_DATA.auth.username,
                password: TEST_DATA.auth.password
            }
        });
        
        try {
            const responseBody = await response.json();
            expect(response.status()).toBe(200);
            expect(responseBody).toBeTruthy();
            expect(JSON.stringify(responseBody)).not.toContain("Bad credentials");
        } catch (error) {
            console.error('Failed to parse response:', await response.text());
            throw error;
        }
    });

    test("Should get booking details by ID", async () => {
        const response = await apiContext.get(`/booking/237`);

        
        expect(response.status()).toBe(200);

        try {
            const responseBody = await response.json();
            console.log(responseBody);

            // Validate firstname and lastname
            expect(responseBody.firstname).toBe(TEST_DATA.booking.expectedData.firstname);
            expect(responseBody.lastname).toBe(TEST_DATA.booking.expectedData.lastname);

            // Validate bookingdates
            expect(responseBody.bookingdates).toBeDefined(); // Ensure bookingdates exists
        } catch (error) {
            console.error('Failed to parse response:', await response.text());
            throw error;
        }
    });

    test("Should check API health", async () => {
        const response = await apiContext.get(`/ping`);
        expect(response.status()).toBe(201);

        try {
            console.log(response);

            const responseBody = await response.text();
            console.log("this is result: ", responseBody)
            expect(responseBody).toBe("Created");

        } catch (error) {

            console.error('Failed to parse response:', await response.text()); 
            throw error;
        }
        // console.log(await response.json());
    });

});