import { useState, useEffect } from "react";

const getMonthDays = (year, month) => {
  if (typeof year !== 'number' || typeof month !== 'number') return 31;
  return new Date(year, month + 1, 0).getDate();
};

export default function Home() {
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [bgm, setBgm] = useState("/default-bgm.mp3");
  const [customBgm, setCustomBgm] = useState("");
  const [showBgmInput, setShowBgmInput] = useState(false);
  const [countdownDate, setCountdownDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [happinessCount, setHappinessCount] = useState(0);

  useEffect(() => {
    const storedPassword = localStorage.getItem("love-site-password");
    if (storedPassword === "11250228") {
      setPasswordValidated(true);
    }

    const savedBgm = localStorage.getItem("bgm");
    if (savedBgm) setBgm(savedBgm);

    const savedDate = localStorage.getItem("countdownDate");
    if (savedDate) {
      const date = new Date(savedDate);
      setCountdownDate(date);
      updateCountdown(date);
    }

    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) setNotes(JSON.parse(savedNotes));

    const storedHappiness = localStorage.getItem("happinessCount");
    if (storedHappiness) setHappinessCount(Number(storedHappiness));
  }, []);

  const updateCountdown = (targetDate) => {
    const now = new Date();
    const timeDiff = targetDate - now;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    setDaysLeft(days);
  };

  const handlePasswordSubmit = () => {
    if (inputPassword === "11250228") {
      localStorage.setItem("love-site-password", "11250228");
      setPasswordValidated(true);
    } else {
      alert("密码错误哦~");
    }
  };

  const handleBgmChange = () => {
    if (customBgm) {
      setBgm(customBgm);
      localStorage.setItem("bgm", customBgm);
      setShowBgmInput(false);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setCountdownDate(selectedDate);
    localStorage.setItem("countdownDate", selectedDate);
    updateCountdown(selectedDate);
  };

  const handleDayClick = (day) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const key = `${year}-${month + 1}-${day}`;
    setSelectedDate(key);
    setNoteInput(notes[key] || "");
  };

  const saveNote = () => {
    const updatedNotes = { ...notes, [selectedDate]: noteInput };
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const deleteNote = () => {
    const updatedNotes = { ...notes };
    delete updatedNotes[selectedDate];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNoteInput("");
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newDate);
  };

  const addHappiness = () => {
    const newCount = happinessCount + 1;
    setHappinessCount(newCount);
    localStorage.setItem("happinessCount", newCount);
  };

  const year = currentMonth?.getFullYear?.();
  const month = currentMonth?.getMonth?.();
  const daysInMonth = getMonthDays(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const weeks = [];
  let currentDay = 1 - firstDay;

  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if (currentDay >= 1 && currentDay <= daysInMonth) {
        week.push(currentDay);
      } else {
        week.push(null);
      }
      currentDay++;
    }
    weeks.push(week);
  }

  return (
    <div className="p-6 bg-blue-100 min-h-screen space-y-6">
      {!passwordValidated ? (
        <div className="h-screen flex flex-col items-center justify-center">
          <h1 className="text-xl mb-4">请输入密码</h1>
          <input
            type="password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="border p-2 rounded mb-2"
          />
          <button onClick={handlePasswordSubmit} className="bg-blue-300 hover:bg-blue-400 px-4 py-1 rounded">
            进入
          </button>
        </div>
      ) : (
        <>
          <audio controls autoPlay loop className="mb-4">
            <source src={bgm} type="audio/mp3" />
            您的浏览器不支持音频播放
          </audio>

          <button
            onClick={() => setShowBgmInput(!showBgmInput)}
            className="mb-4 bg-blue-300 hover:bg-blue-400 px-4 py-1 rounded"
          >
            更换BGM
          </button>

          {showBgmInput && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="输入mp3链接"
                value={customBgm}
                onChange={(e) => setCustomBgm(e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              <button onClick={handleBgmChange} className="bg-blue-300 hover:bg-blue-400 px-4 py-1 rounded">保存</button>
            </div>
          )}

          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-2">见面倒计时</h2>
            <input type="date" onChange={handleDateChange} className="border p-2 rounded mb-2" />
            {daysLeft !== null && <p>距离见面还有 {daysLeft} 天 💖</p>}
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-2">幸福计数器</h2>
            <p className="mb-2">我们已经记录了 <span className="text-pink-500 font-bold">{happinessCount}</span> 次幸福 ✨</p>
            <button onClick={addHappiness} className="bg-pink-300 hover:bg-pink-400 px-4 py-2 rounded-full shadow">
              +1 
            </button>
          </div>

          <div className="p-4 bg-white bg-opacity-80 rounded-xl shadow-md backdrop-blur-md border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <button onClick={() => changeMonth(-1)} className="bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded">上个月</button>
              <h2 className="text-lg">{year} 年 {month + 1} 月</h2>
              <button onClick={() => changeMonth(1)} className="bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded">下个月</button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
                <div key={d} className="text-center font-bold">{d}</div>
              ))}
              {weeks.flat().map((day, idx) => (
                <div
                  key={idx}
                  onClick={() => day && handleDayClick(day)}
                  className={`h-10 flex items-center justify-center border rounded cursor-pointer ${day ? 'bg-white hover:bg-blue-100' : ''}`}
                >
                  {day || ""}
                </div>
              ))}
            </div>
            {selectedDate && (
              <div className="mt-4">
                <h3 className="text-md font-bold mb-1">{selectedDate} 的心情札记：</h3>
                <textarea
                  className="w-full border border-pink-200 bg-pink-50 p-2 rounded-lg shadow-inner mb-2 focus:outline-none"
                  rows={4}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={saveNote} className="bg-blue-200 hover:bg-blue-300 px-3 py-1 rounded">保存</button>
                  <button onClick={deleteNote} className="bg-red-200 hover:bg-red-300 px-3 py-1 rounded">删除</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
