interface protocol {
  ProtocolId: number;
  ProtocolName: string;
}

async function getProtocols() {
  const query = new URLSearchParams();

  const response = await fetch(
    `http://127.0.0.1:8000/activities?${query.toString()}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  const data = await response.json();
  return data as protocol[];
}
