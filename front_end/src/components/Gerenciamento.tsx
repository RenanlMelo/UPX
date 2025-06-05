import { Fragment, useEffect, useState } from "react";
import {
  deviceTrafficLog,
  deviceTrafficLogHeaders,
  getDateList,
  getDeviceTrafficLogs,
  getTotalLogs,
} from "../data/device_traffic_logs";
import { ArrowLeft, ArrowRight, ChevronDown, ListCheck } from "lucide-react";

type SortKey = keyof deviceTrafficLog;

export default function Gerenciamento() {
  const [sortKey, setSortKey] = useState<keyof deviceTrafficLog>("DeviceName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [openId, setOpenId] = useState<number | null>(null);
  const [trafficLogs, setTrafficLogs] = useState<deviceTrafficLog[]>([]);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [dateList, setDateList] = useState<string[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [isDateListOpen, setIsDateListOpen] = useState(false);

  const totalPages = Math.ceil(totalLogs / limit);

  useEffect(() => {
    getDateList()
      .then((list) => {
        setDateList(list);
        setCurrentDate(list[0] || "");
      })
      .catch((err) => console.error("Erro ao buscar lista de datas:", err));
  }, []);

  useEffect(() => {
    if (!currentDate) return;

    const skip = (currentPage - 1) * limit;

    getDeviceTrafficLogs(skip, limit, currentDate, sortKey, sortDirection)
      .then(setTrafficLogs)
      .catch((err) => console.error("Erro ao buscar logs:", err));

    getTotalLogs(currentDate)
      .then(setTotalLogs)
      .catch((err) => console.error("Erro ao contar logs:", err));
  }, [currentPage, limit, currentDate, sortKey, sortDirection]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleDetailsClick = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleDateSelect = (date: string) => {
    setCurrentDate(date);
    setCurrentPage(1);
    setIsDateListOpen(false);
  };

  const sortedLogs = [...trafficLogs].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    return sortDirection === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  function handleNextDate() {
    const currentIndex = dateList.indexOf(currentDate);
    const nextIndex = (currentIndex + 1) % dateList.length;
    handleDateSelect(dateList[nextIndex]);
  }

  function handlePreviousDate() {
    const currentIndex = dateList.indexOf(currentDate);
    // Para evitar índice negativo, usamos (length + currentIndex - 1) % length
    const prevIndex = (dateList.length + currentIndex - 1) % dateList.length;
    handleDateSelect(dateList[prevIndex]);
  }

  return (
    <main className="min-h-screen w-[100vw-16px] rounded-lg m-4 bg-white shadow px-6 py-8">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-[var(--primary)] font-bold text-2xl">
          <ListCheck
            size={28}
            strokeWidth={3}
            className="inline -translate-y-[2px]"
          />{" "}
          Gerenciamento Detalhado de Dispositivos
        </h2>
        <div>
          <label
            id="listbox-label"
            className="block text-sm font-medium text-gray-900"
          >
            Data
          </label>
          <div className="relative mt-2">
            <button
              type="button"
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  handleNextDate();
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  handlePreviousDate();
                }
              }}
              onClick={() => setIsDateListOpen((prev) => !prev)}
              className="w-full rounded-md bg-white py-1.5 pr-4 pl-3 text-left text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-[var(--primary)] sm:text-sm"
              aria-haspopup="listbox"
              aria-expanded={isDateListOpen}
              aria-labelledby="listbox-label"
            >
              <span className="flex items-center justify-between">
                <span className="block truncate">{currentDate}</span>
                <ChevronDown className="ml-2 h-5 w-5 text-gray-500" />
              </span>
            </button>
            {isDateListOpen && (
              <ul
                className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 sm:text-sm"
                tabIndex={-1}
                role="listbox"
                aria-labelledby="listbox-label"
              >
                {dateList.map((date) => (
                  <li
                    key={date}
                    className={`cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100 ${
                      date === currentDate ? "font-semibold" : "font-normal"
                    }`}
                    role="option"
                    aria-selected={date === currentDate}
                    onClick={() => handleDateSelect(date)}
                  >
                    {date}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          id="tabela_gerenciamento"
          className="min-w-full border border-gray-200 text-left"
        >
          <thead className="bg-[var(--primary)] text-white">
            <tr className="grid grid-cols-4">
              {Object.entries(deviceTrafficLogHeaders).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key as SortKey)}
                  className="px-4 py-3 cursor-pointer hover:bg-[var(--primary-dark)] select-none"
                >
                  {label}{" "}
                  {sortKey === key && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedLogs.map((d) => (
              <Fragment key={d.LogId}>
                <tr
                  className="hover:bg-gray-50 grid grid-cols-4 cursor-pointer"
                  onClick={() => handleDetailsClick(d.LogId)}
                >
                  <td className="px-4 py-2">{d.DeviceName}</td>
                  <td className="px-4 py-2">{d.DeviceIP}</td>
                  <td className="px-4 py-2">{d.UploadMB}</td>
                  <td className="px-4 py-2 relative">
                    {d.DownloadMB}
                    <ChevronDown
                      size={20}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer duration-200 ${
                        openId === d.LogId ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </td>
                </tr>
                {openId === d.LogId && (
                  <tr>
                    <td colSpan={4} className="p-4 bg-gray-100">
                      <p className="font-semibold mb-2">Detalhes:</p>
                      <div className="flex flex-col text-sm">
                        <div>
                          <strong>Descrição </strong>
                          <p id="descricao">{d.Description}</p>
                        </div>
                        <div>
                          <strong>Protocolo</strong>
                          <p id="protocolo">{d.ProtocolName}</p>
                        </div>
                        <div>
                          <strong>Departamento</strong>
                          <p id="departamento">{d.DepartmentName}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2 mt-4 items-center">
        {currentPage > 1 && (
          <>
            <button
              id="previous_page"
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {currentPage - 1}
            </button>
          </>
        )}
        <span className="px-3 py-2 font-semibold bg-[var(--primary)] text-white rounded">
          {currentPage}
        </span>
        {currentPage < totalPages && (
          <>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {currentPage + 1}
            </button>
            <button
              id="next_page"
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <ArrowRight size={20} />
            </button>
          </>
        )}
      </div>
    </main>
  );
}
