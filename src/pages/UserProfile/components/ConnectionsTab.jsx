import Icon from 'components/AppIcon'
import React from 'react'

const ConnectionsTab = () => {
  return (
    <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      Connected Accounts
    </h2>
    <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Icon name="Google" size={20} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Google</h3>
                  <p className="text-sm text-gray-500">
                    Connected for authentication
                  </p>
                </div>
              </div>
              <button className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50">
                Disconnect
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <Icon name="Facebook" size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Facebook</h3>
                  <p className="text-sm text-gray-500">Not connected</p>
                </div>
              </div>
              <button className="px-3 py-1 text-sm text-primary border border-primary rounded-md hover:bg-blue-50">
                Connect
              </button>
            </div>
          </div>
  </div>
  )
}

export default ConnectionsTab



  
