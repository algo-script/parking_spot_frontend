import React from 'react'

const BillingTab = () => {
  return (
    <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      Billing & Payments
    </h2>
    <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Payment Methods
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">No payment methods added</p>
                <button className="mt-2 px-3 py-1 text-sm text-primary border border-primary rounded-md hover:bg-blue-50">
                  Add Payment Method
                </button>
              </div>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Billing History
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">No billing history available</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Subscription
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  You're currently on the free plan
                </p>
                <button className="mt-2 px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
  </div>
  )
}

export default BillingTab

  
