export type Device = {
  device: string;
  ip: string;
  mac: string;
  download: number;
  upload: number;
};

export const devices: Device[] = [
  {
    device: "John’s iPhone",
    ip: "192.168.0.101",
    mac: "AA:BB:CC:DD:EE:01",
    download: 191.2,
    upload: 29.2,
  },
  {
    device: "Laptop-Win10",
    ip: "192.168.0.102",
    mac: "AA:BB:CC:DD:EE:02",
    download: 620.5,
    upload: 95.3,
  },
  {
    device: "Smart TV",
    ip: "192.168.0.103",
    mac: "AA:BB:CC:DD:EE:03",
    download: 95.0,
    upload: 5.5,
  },
];
