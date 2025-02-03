import { Component } from "@angular/core";

@Component({ standalone: true, template: "Mock Login Page" })
class MockLoginComponent {}

@Component({ standalone: true, template: "Mock Teams Page" })
class MockTeamsComponent {}

@Component({ standalone: true, template: "Mock Transactions Page" })
class MockTransactionsComponent {}

@Component({ standalone: true, template: "Mock Profile Page" })
class MockProfileComponent {}

@Component({ standalone: true, template: "Mock About Page" })
class MockAboutComponent {}

@Component({ standalone: true, template: "Mock Feedback Page" })
class MockFeedbackComponent {}

export const mockRoutes = [
  { path: "login", component: MockLoginComponent },
  { path: "teams", component: MockTeamsComponent },
  { path: "transactions", component: MockTransactionsComponent },
  { path: "profile", component: MockProfileComponent },
  { path: "about", component: MockAboutComponent },
  { path: "feedback", component: MockFeedbackComponent },
  { path: "", component: MockLoginComponent },
];
