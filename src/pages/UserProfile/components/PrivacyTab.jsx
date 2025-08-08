import React from 'react'

const PrivacyTab = () => {
  return (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Privacy Settings
        </h2>
        <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    Profile Visibility
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="visibility-public"
                        name="visibility"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        defaultChecked
                      />
                      <label
                        htmlFor="visibility-public"
                        className="ml-2 block text-sm font-medium text-gray-700"
                      >
                        Public - Anyone can see your profile
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="visibility-private"
                        name="visibility"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label
                        htmlFor="visibility-private"
                        className="ml-2 block text-sm font-medium text-gray-700"
                      >
                        Private - Only you can see your profile
                      </label>
                    </div>
                  </div>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    Data Sharing
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label
                          htmlFor="share-analytics"
                          className="font-medium text-gray-700"
                        >
                          Share analytics data
                        </label>
                        <p className="text-sm text-gray-500">
                          Help us improve our services by sharing anonymous usage
                          data
                        </p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="share-analytics"
                          className="sr-only"
                          defaultChecked
                        />
                        <label
                          htmlFor="share-analytics"
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
                    Save Settings
                  </button>
                </div>
              </div>
      </div>
  )
}

export default PrivacyTab

