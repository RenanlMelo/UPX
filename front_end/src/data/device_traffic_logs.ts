export interface deviceTrafficLog {
  //DeviceTrafficLogs
  UploadMB: number;
  DownloadMB: number;
  LogDate: Date;
  LogId: number;
  //Activities
  Description: string;
  //Devices
  DeviceIP: string;
  DeviceName: string;
  RouterIP: string;
  //Protocols
  ProtocolName: string;
  //Departments
  DepartmentName: string;
}

export const deviceTrafficLogHeaders: Partial<
  Record<keyof deviceTrafficLog, string>
> = {
  DeviceName: "Device Name",
  DeviceIP: "Device IP",
  UploadMB: "Upload (MB)",
  DownloadMB: "Download (MB)",
};

export async function getDeviceTrafficLogs(
  skip = 0,
  limit = 0,
  datetime: string,
  sortKey?: keyof deviceTrafficLog,
  sortDirection?: "asc" | "desc"
) {
  const query = new URLSearchParams({
    date: datetime,
    skip: skip.toString(),
    limit: limit.toString(),
  });

  if (sortKey && sortDirection) {
    query.append("sortKey", sortKey);
    query.append("sortDirection", sortDirection);
  }

  const response = await fetch(
    `http://127.0.0.1:8000/device_traffic_logs?${query.toString()}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch traffic logs");
  }

  const data = await response.json();

  return data.map((log: any) => ({
    ...log,
    LogDate: new Date(log.LogDate),
  })) as deviceTrafficLog[];
}

export async function getTotalLogs(datetime: string) {
  const query = new URLSearchParams({
    date: datetime,
  });

  const response = await fetch(
    `http://127.0.1:8000/device_traffic_logs/count?${query.toString()}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failted to fetch total logs");
  }

  const data = await response.json();
  return data.total as number;
}

export async function getDateList() {
  const response = await fetch(
    "http://127.0.1:8000/device_traffic_logs/dates",
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch date list");
  }

  const data = await response.json();

  return data.map((item: { LogDate: string }) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const utcDate = new Date(item.LogDate);
    const localDate = new Date(
      utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
    );
    return localDate.toLocaleDateString("pt-BR", options);
  });
}
