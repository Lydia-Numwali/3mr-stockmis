import {
  AttendanceEntry,
  AttendanceStatus,
} from "@/components/common/AttendanceCell";

export const transformApiEmployees = (
  apiEmployees: any[]
): {
  id: string;
  name: string;
  attendance: Record<number, AttendanceEntry>;
  p: number;
  a: number;
  l: number;
}[] => {
  const statusMap: Record<string, AttendanceStatus> = {
    present: "P",
    absent: "A",
    late_present: "LP",
    leave: "L",
    weekend: "W",
    holiday: "H",
  };

  const today = new Date();

  return apiEmployees.map((emp) => {
    const attendance: Record<number, AttendanceEntry> = {};

    emp.attendance.forEach(
      (entry: {
        date: string;
        status: string;
        name?: string;
        duration?: string;
        checkInTime?:string;
        checkOutTime?:string;
      }) => {
        const entryDate = new Date(entry.date);

        // Skip future dates
        if (entryDate > today) return;

        const day = entryDate.getDate();
        attendance[day] = {
          status: statusMap[entry.status] ?? "",
          name: entry?.name,
          duration: entry?.duration,
          checkInTime:entry?.checkInTime,
          checkOutTime:entry?.checkOutTime,
        };
      }
    );

    return {
      id: emp.id,
      name: emp.name,
      attendance,
      p: emp.summary?.presentDays ?? 0,
      a: emp.summary?.absentDays ?? 0,
      l: emp.summary?.leaveDays ?? 0,
    };
  });
};

export const transformApiEmployee = (
  emp: any
): {
  id: string;
  name: string;
  attendance: Record<number, AttendanceEntry>;
  p: number;
  a: number;
  l: number;
} => {
  const statusMap: Record<string, AttendanceStatus> = {
    present: "P",
    absent: "A",
    late_present: "LP",
    leave: "L",
    weekend: "W",
    holiday: "H",
  };

  const today = new Date();
  const attendance: Record<number, AttendanceEntry> = {};

  emp?.attendance?.forEach(
    (entry: {
      date: string;
      status: string;
      name?: string;
      duration?: string;
    }) => {
      const entryDate = new Date(entry?.date);

      // Skip future dates
      if (entryDate > today) return;

      const day = entryDate.getDate();
      attendance[day] = {
        status: statusMap[entry.status] ?? "",
        name: entry?.name,
        duration: entry?.duration,
      };
    }
  );

  return {
    id: emp?.id,
    name: emp?.name,
    attendance,
    p: emp?.summary?.presentDays ?? 0,
    a: emp?.summary?.absentDays ?? 0,
    l: emp?.summary?.leaveDays ?? 0,
  };
};
