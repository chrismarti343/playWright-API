import {test, expect } from '@playwright/test';

const REPO = 'playWright-API';
const USER = 'chrismarti343';

test('Create an issue in gitHub', async ({ request }) => {
    const newIssue = await request.post(`/repos/${USER}/${REPO}/issues`, {
        data: {
            title: '[Bug4] First bug detected',
            body: 'Testing first bug!'
        }
    });
    expect(newIssue.ok()).toBeTruthy();

    const issues = await request.get(`/repos/${USER}/${REPO}/issues`);
    expect(issues.ok()).toBeTruthy();
    expect(await issues.json()).toContainEqual(expect.objectContaining({
        title: '[Bug4] First bug detected',
        body: 'Testing first bug!'
    }));
});