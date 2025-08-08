import React from 'react'

const NotificationsTab = () => {
  return (
    <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      Notification Preferences
    </h2>
    <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Email Notifications
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="email-news"
                      className="font-medium text-gray-700"
                    >
                      News and updates
                    </label>
                    <p className="text-sm text-gray-500">
                      Receive product updates and announcements
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="email-news"
                      className="sr-only"
                      defaultChecked
                    />
                    <label
                      htmlFor="email-news"
                      className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out translate-x-4"></span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="email-reminders"
                      className="font-medium text-gray-700"
                    >
                      Reminders
                    </label>
                    <p className="text-sm text-gray-500">
                      Receive important reminders
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="email-reminders"
                      className="sr-only"
                      defaultChecked
                    />
                    <label
                      htmlFor="email-reminders"
                      className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out translate-x-4"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Push Notifications
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="push-messages"
                      className="font-medium text-gray-700"
                    >
                      New messages
                    </label>
                    <p className="text-sm text-gray-500">
                      Notify me about new messages
                    </p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="push-messages"
                      className="sr-only"
                      defaultChecked
                    />
                    <label
                      htmlFor="push-messages"
                      className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out translate-x-4"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200">
                Save Preferences
              </button>
            </div>
          </div>
  </div>
  )
}

export default NotificationsTab

