import React, { useState } from 'react';

const InventoryApp = () => {
  const [currentScreen, setCurrentScreen] = useState('select-employee');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [items, setItems] = useState([]); // פריטים בספירה נוכחית
  const [savedCounts, setSavedCounts] = useState([]); // היסטוריית ספירות
  const [viewMode, setViewMode] = useState('count'); // 'count' או 'history'

  const categories = [
    { id: 'lab', name: 'מעבדה' },
    { id: 'devices', name: 'מכשירים' },
    { id: 'gaming', name: 'גיימינג' },
    { id: 'protection', name: 'מיגון' }
  ];

  const employees = [
    { id: 1, name: 'עידו' },
    { id: 2, name: 'ניר' },
    { id: 3, name: 'יהונתן' },
    { id: 4, name: 'רתם' }
  ];

  // מסך בחירת עובד
  const SelectEmployeeScreen = () => {
    const allEmployees = [
      { id: 1, name: 'עידו' },
      { id: 2, name: 'ניר' },
      { id: 3, name: 'יהונתן' },
      { id: 4, name: 'רתם' },
      { id: 5, name: 'ליאב', isAdmin: true }
    ];

    return (
      <div className="min-h-screen p-6 flex flex-col justify-center" dir="rtl">
        <h1 className="text-3xl font-bold text-center mb-12">ספירת מלאי</h1>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {allEmployees.map(employee => (
            <button
              key={employee.id}
              onClick={() => {
                setSelectedEmployee(employee);
                setCurrentScreen(employee.isAdmin ? 'admin' : 'inventory');
                if (!employee.isAdmin) setViewMode('count');
              }}
              className="bg-white hover:bg-pink-50 text-xl p-6 rounded-xl border-2 border-pink-500 text-pink-500 font-medium"
            >
              {employee.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // מסך מנהל
  const AdminScreen = () => {
    const [selectedCount, setSelectedCount] = useState(null);
    
    const pendingCounts = savedCounts.filter(count => count.status === 'ממתין לאישור');
    const approvedCounts = savedCounts.filter(count => count.status === 'מאושר');

    const handleApproveCount = (countId) => {
      setSavedCounts(savedCounts.map(count => 
        count.id === countId 
          ? { ...count, status: 'מאושר', approvedDate: new Date().toLocaleDateString() }
          : count
      ));
    };

    return (
      <div className="p-6 max-w-4xl mx-auto" dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">ניהול ספירות מלאי</h1>
            <div className="text-blue-500 font-medium">
              {selectedEmployee?.name} - מנהל
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentScreen('select-employee');
              setSelectedEmployee(null);
            }}
            className="bg-gray-100 px-4 py-2 rounded-lg"
          >
            התנתק
          </button>
        </div>

        {/* ספירות ממתינות לאישור */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            ממתין לאישור
            {pendingCounts.length > 0 && (
              <span className="mr-2 text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                {pendingCounts.length}
              </span>
            )}
          </h2>
          
          {pendingCounts.length > 0 ? (
            <div className="space-y-4">
              {pendingCounts.map(count => (
                <div key={count.id} className="bg-white p-4 rounded-xl border">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">{count.employee}</span>
                      <span className="text-gray-500 text-sm mr-2">
                        {count.date} {count.time}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCount(count)}
                        className="bg-blue-100 text-blue-500 px-3 py-1 rounded-lg text-sm"
                      >
                        צפה בפרטים
                      </button>
                      <button
                        onClick={() => handleApproveCount(count.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        אשר ספירה
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {count.totalItems} פריטים | סה"כ: ₪{count.totalValue}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-xl">
              אין ספירות הממתינות לאישור
            </div>
          )}
        </div>

        {/* ספירות מאושרות */}
        <div>
          <h2 className="text-xl font-bold mb-4">היסטוריית ספירות מאושרות</h2>
          {approvedCounts.length > 0 ? (
            <div className="space-y-4">
              {approvedCounts.map(count => (
                <div key={count.id} className="bg-white p-4 rounded-xl border">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">{count.employee}</span>
                      <span className="text-gray-500 text-sm mr-2">
                        {count.date} {count.time}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedCount(count)}
                      className="bg-gray-100 px-3 py-1 rounded-lg text-sm"
                    >
                      צפה בפרטים
                    </button>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="text-gray-600">
                      {count.totalItems} פריטים | סה"כ: ₪{count.totalValue}
                    </div>
                    <div className="text-green-600">
                      אושר ב-{count.approvedDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-xl">
              אין ספירות מאושרות
            </div>
          )}
        </div>

        {/* מודל צפייה בפרטי ספירה */}
        {selectedCount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold">פרטי ספירה</h3>
                  <div className="text-gray-500">
                    {selectedCount.employee} | {selectedCount.date} {selectedCount.time}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCount(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  סגור ×
                </button>
              </div>
              
              <div className="space-y-3">
                {selectedCount.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{item.product}</span>
                      <span className="text-gray-500">
                        {categories.find(cat => cat.id === item.category)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>כמות: {item.quantity}</span>
                      <span>מחיר: ₪{item.price}</span>
                      <span>סה"כ: ₪{item.totalCost}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>סה"כ פריטים: {selectedCount.totalItems}</span>
                  <span>סה"כ שווי: ₪{selectedCount.totalValue}</span>
                </div>
              </div>

              {selectedCount.status === 'ממתין לאישור' && (
                <button
                  onClick={() => {
                    handleApproveCount(selectedCount.id);
                    setSelectedCount(null);
                  }}
                  className="w-full bg-green-500 text-white p-3 rounded-lg mt-4"
                >
                  אשר ספירה
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // מסך ספירת מלאי
  const InventoryScreen = () => {
    const [formData, setFormData] = useState({
      product: '',
      quantity: '',
      price: '',
      category: 'lab'
    });

    // מקבל רק את הספירות של העובד הנוכחי
    const employeeCounts = savedCounts.filter(count => 
      count.employee === selectedEmployee.name
    );

    const handleAddItem = () => {
      if (formData.product && formData.quantity && formData.price) {
        const newItem = {
          ...formData,
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString('he-IL'),
          totalCost: Number(formData.quantity) * Number(formData.price)
        };
        
        setItems([...items, newItem]);
        setFormData({ ...formData, product: '', quantity: '', price: '' });
      } else {
        alert('נא למלא את כל השדות');
      }
    };

    const handleSaveCount = () => {
      if (items.length === 0) {
        alert('אין פריטים לשמירה');
        return;
      }

      const newCount = {
        id: Date.now(),
        employee: selectedEmployee.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        items: [...items],
        status: 'ממתין לאישור',
        totalItems: items.length,
        totalValue: items.reduce((sum, item) => sum + (item.totalCost || 0), 0)
      };

      setSavedCounts([...savedCounts, newCount]);
      setItems([]); // ניקוי הפריטים הנוכחיים
      alert('הספירה נשמרה ונשלחה לאישור');
    };

    // תצוגת היסטוריה
    if (viewMode === 'history') {
      return (
        <div className="p-6 max-w-xl mx-auto" dir="rtl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">הספירות שלי</h1>
              <div className="text-pink-500 font-medium">
                {selectedEmployee?.name}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('count')}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg"
              >
                ספירה חדשה
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('select-employee');
                  setSelectedEmployee(null);
                }}
                className="bg-gray-100 px-4 py-2 rounded-lg"
              >
                החלף משתמש
              </button>
            </div>
          </div>

          {employeeCounts.length > 0 ? (
            <div className="space-y-4">
              {employeeCounts.map(count => (
                <div key={count.id} className="bg-white p-4 rounded-xl border">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">
                      {count.date} - {count.time}
                    </div>
                    <span className={`
                      px-2 py-1 rounded-lg text-sm
                      ${count.status === 'מאושר' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                    `}>
                      {count.status}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    <div className="flex justify-between text-sm">
                      <span>{count.totalItems} פריטים</span>
                      <span>סה"כ: ₪{count.totalValue}</span>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {count.items.map((item, index) => (
                      <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                        <div className="flex justify-between">
                          <span>{item.product}</span>
                          <span>{categories.find(cat => cat.id === item.category)?.name}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>כמות: {item.quantity}</span>
                          <span>₪{item.totalCost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              אין ספירות בהיסטוריה
            </div>
          )}
        </div>
      );
    }

    // תצוגת ספירה
    return (
      <div className="p-6 max-w-xl mx-auto" dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">ספירת מלאי</h1>
            <div className="text-pink-500 font-medium">
              {selectedEmployee?.name}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('history')}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg"
            >
              הספירות שלי
            </button>
            <button
              onClick={() => {
                setCurrentScreen('select-employee');
                setSelectedEmployee(null);
              }}
              className="bg-gray-100 px-4 py-2 rounded-lg"
            >
              החלף משתמש
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="שם המוצר"
            className="w-full p-4 border rounded-xl"
            value={formData.product}
            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="כמות"
              className="p-4 border rounded-xl"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
            <input
              type="number"
              placeholder="מחיר ליחידה"
              className="p-4 border rounded-xl"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {categories.map(cat => (
              <label
                key={cat.id}
                className={`
                  flex items-center justify-center p-4 rounded-xl cursor-pointer
                  ${formData.category === cat.id ? 'bg-pink-500 text-white' : 'bg-white border'}
                `}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={formData.category === cat.id}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="hidden"
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleAddItem}
            className="w-full bg-pink-500 text-white p-4 rounded-xl font-medium"
          >
            הוסף פריט
          </button>

          {items.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">פריטים בספירה הנוכחית</h2>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.product}</span>
                      <span>{categories.find(cat => cat.id === item.category)?.name}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>כמות: {item.quantity}</span>
                      <span>מחיר: ₪{item.price}</span>
                      <span>סה"כ: ₪{item.totalCost}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveCount}
                className="w-full bg-green-500 text-white p-4 rounded-xl font-medium mt-4"
              >
                שמור ושלח לאישור
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  switch (currentScreen) {
    case 'select-employee':
      return <SelectEmployeeScreen />;
    case 'inventory':
      return <InventoryScreen />;
    case 'admin':
      return <AdminScreen />;
    default:
      return <SelectEmployeeScreen />;
  }
};

export default InventoryApp;