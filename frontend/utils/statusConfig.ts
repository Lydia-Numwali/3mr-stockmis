export function getStatusConfig(status: string, checkInTime?: string, checkOutTime?: string) {
  switch (status) {
    case "APPROVED":
      return {
        color: "bg-green-100 text-green-800",
        icon: "solar:check-circle-bold",
        label: "Approved",
      };
    case "PENDING":
      return {
        color: "bg-yellow-100 text-yellow-800",
        icon: "solar:clock-circle-bold",
        label: "Pending",
      };
    case "REJECTED":
      return {
        color: "bg-red-100 text-red-800",
        icon: "solar:close-circle-bold",
        label: "Rejected",
      };
    case "CHECKED_IN":
      return {
        color: "bg-blue-100 text-blue-800",
        icon: "solar:user-check-bold",
        label: checkInTime ? "Entered" : "Entered",
      };
    case "CHECKED_OUT":
      return {
        color: "bg-gray-100 text-gray-800",
        icon: "solar:logout-2-bold",
        label: checkOutTime ? "Exited" : "Exited",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800",
        icon: "solar:question-circle-bold",
        label: status,
      };
  }
}
