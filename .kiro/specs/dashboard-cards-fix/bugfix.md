# Bugfix Requirements Document

## Introduction

The dashboard cards are currently displaying incorrect information due to a mismatch between the backend API response structure and the frontend component expectations. The dashboard should show 8 specific inventory management metrics, but currently shows only 4 cards with wrong or missing data fields. This affects the core business intelligence functionality of the inventory management system.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the dashboard loads THEN the system displays "Total Products" card but receives undefined data because the backend returns `totalItemsInStock` instead of `totalProducts`

1.2 WHEN the dashboard loads THEN the system displays "Lent Items" card but receives undefined data because the backend returns `lentProducts` instead of `productsLentOut`

1.3 WHEN the dashboard loads THEN the system displays "Stock Alerts" card but receives undefined data because the backend doesn't provide `lowStockCount` field

1.4 WHEN the dashboard loads THEN the system displays "Income This Month" card but receives undefined data because the backend doesn't provide `revenueThisMonth` field

1.5 WHEN the dashboard loads THEN the system shows only 4 cards instead of the required 8 business metrics

1.6 WHEN the dashboard loads THEN the system doesn't display critical inventory metrics like "Total Sales", "Total Purchases", "Value of Sales", "Value of Purchases", and "Stock Balance"

### Expected Behavior (Correct)

2.1 WHEN the dashboard loads THEN the system SHALL display "Total Products" card showing the count of unique products in the system

2.2 WHEN the dashboard loads THEN the system SHALL display "Lent Products" card showing the number of items currently lent out

2.3 WHEN the dashboard loads THEN the system SHALL display "Total Sales" card showing the total number of sales transactions

2.4 WHEN the dashboard loads THEN the system SHALL display "Total Purchases" card showing the total number of purchase transactions

2.5 WHEN the dashboard loads THEN the system SHALL display "Value of Sales" card showing the total monetary value of all sales

2.6 WHEN the dashboard loads THEN the system SHALL display "Value of Purchases" card showing the total monetary value of all purchases

2.7 WHEN the dashboard loads THEN the system SHALL display "Stock Balance" card showing the calculated difference between total purchase value and total sales value

2.8 WHEN the dashboard loads THEN the system SHALL display "Items in Stock" card showing the total quantity of all items currently in inventory

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the dashboard API is called THEN the system SHALL CONTINUE TO return accurate calculations for sales, purchases, and stock quantities

3.2 WHEN the dashboard loads THEN the system SHALL CONTINUE TO display cards with proper styling, icons, and responsive layout

3.3 WHEN the dashboard data is loading THEN the system SHALL CONTINUE TO show loading states and skeleton placeholders

3.4 WHEN the dashboard encounters API errors THEN the system SHALL CONTINUE TO handle errors gracefully without crashing