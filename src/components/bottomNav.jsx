function BottomNav({ userRole }) {
  const menuList =
    userRole === 3
      ? [
          { name: "Manage", link: "/leads" },
          { name: "New", link: "/leads/new" },
          { name: "Imports", link: "/leads/imports" },
          { name: "Today", link: "/leads/today" },
        ]
      : userRole === 2
      ? [
          { name: "Pool", link: "/leads" },
          { name: "Imports", link: "/leads/imports" },
        ]
      : userRole === 1
      ? [
          { name: "Course", link: "/leads" },
          { name: "Source", link: "/leads/imports" },
          { name: "Batch", link: "/leads/imports" },
          { name: "Status", link: "/leads/imports" },
        ]
      : [];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-gray-700 border-gray-600">
      <div className="flex items-center justify-between h-full max-w-lg mx-auto font-medium">
        <div className="flex">
          {menuList.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="inline-flex flex-col items-center justify-center px-5 py-2 rounded hover:bg-gray-800 group transition-all duration-200 ease-in-out"
            >
              <span className="text-sm text-white group-hover:text-blue-500">
                {item.name}
              </span>
            </a>
          ))}
        </div>

        {userRole != 1 && (
          <div>
            <a
              href="/leads/addnewlead"
              type="a"
              className="inline-flex flex-col items-center justify-center px-5 py-2 rounded hover:bg-gray-800 group transition-all duration-200 ease-in-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="24"
                height="24"
                className="text-white font-bold text-sm group-hover:text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default BottomNav;
