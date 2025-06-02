interface device {
  DeviceId: number;
  DeviceName: string;
  RouterIP: string;
  DeviceIP: string;
}

export async function getDevices() {
  const query = new URLSearchParams();

  const response = await fetch(
    `http://127.0.0.1:8000/devices?${query.toString()}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  const data = await response.json();
  return data as device[];
}
