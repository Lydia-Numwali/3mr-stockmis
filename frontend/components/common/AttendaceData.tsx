import React from "react";

// Define the attendance data structure
export interface AttendanceRecord {
  id: string;
  name: string;
  present: number;
  lateDays: number;
  absence: number;
  halfDays: number;
  paidLeaves: number;
  lop: number; // Loss of pay
  ot: number; // Overtime
  expired: number;
  exceeded: number;
  attendance: Record<string, string>;
}

// Sample attendance data for the current month
export const generateAttendanceData = (month: number, year: number): AttendanceRecord[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create sample employee data
  const employees = [
    { id: "1", name: "John Doe", present: 0, lateDays: 0, absence: 0, halfDays: 0, paidLeaves: 0, lop: 0, ot: 0, expired: 0, exceeded: 0 },
    { id: "2", name: "Jane Smith", present: 0, lateDays: 0, absence: 0, halfDays: 0, paidLeaves: 0, lop: 0, ot: 0, expired: 0, exceeded: 0 },
    { id: "3", name: "Robert Brown", present: 0, lateDays: 0, absence: 0, halfDays: 0, paidLeaves: 0, lop: 0, ot: 0, expired: 0, exceeded: 0 },
    { id: "4", name: "Emily Johnson", present: 0, lateDays: 0, absence: 0, halfDays: 0, paidLeaves: 0, lop: 0, ot: 0, expired: 0, exceeded: 0 },
    { id: "5", name: "Michael Wilson", present: 0, lateDays: 0, absence: 0, halfDays: 0, paidLeaves: 0, lop: 0, ot: 0, expired: 0, exceeded: 0 },
    { id: "6", name: "Sarah Thompson", present: 0, lateDays: 0, absence: 0, halfDays: 0, paidLeaves: 0, lop: 0, ot: 0, expired: 0, exceeded: 0 },
    { id: "7", name: "David Lee", present: 0, lateDays: 0, absence: 0, halfDays: 0, paidLeaves: 0, lop: 0, ot: 0, expired: 0, exceeded: 0 },
    { id: "8", name: "Jessica Martin", present: 0, lateDays: 0, absence: 0, halfDays: 0, paidLeaves: 0, lop: 0, ot: 0, expired: 0, exceeded: 0 },
  ];

  return employees.map(employee => {
    const attendance: Record<string, string> = {};
    
    // Generate attendance for each day - all empty by default except for Sundays (Weekend)
    for (let day = 1; day <= daysInMonth; day++) {
      // Check if the day is Sunday (0)
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 0) {
        attendance[day] = "W";
      } else {
        attendance[day] = "";
      }
    }
    
    return {
      ...employee,
      attendance
    };
  });
};  