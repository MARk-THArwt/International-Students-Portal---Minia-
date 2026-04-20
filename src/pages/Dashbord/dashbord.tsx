import {Sidebar} from './../../component/DashbordComp/Slider'
import {Topbar} from '../../component/DashbordComp/Topbar'
import {Card} from '../../component/DashbordComp/Card'
import {DashboardTable} from '../../component/DashbordComp/table'
export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">

        <Topbar />

        
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <Card title="ACTIVE REQUESTS" value="3">
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="bg-yellow-100 text-yellow-700 px-2 rounded-full text-xs">
                2 Pending
              </span>
              <span className="bg-blue-100 text-blue-700 px-2 rounded-full text-xs">
                1 In Review
              </span>
            </div>
          </Card>

          <Card title="OUTSTANDING FEES" value="$4,500">
            <p className="text-xs text-gray-500">Due Oct 15, 2026</p>
            <button className="text-blue-600 text-sm mt-2">
              PAY NOW →
            </button>
          </Card>

          <Card title="PROFILE STATUS" value="85%">
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div className="bg-blue-600 h-2 rounded-full w-[85%]" />
            </div>
          </Card>

          {/* Gradient */}
          <div className="p-4 rounded-xl text-white bg-gradient-to-r from-blue-900 to-blue-600 shadow-sm">
            <p>Tuition Balance Due</p>
            <h2 className="text-2xl font-bold">$1,200.00</h2>
            <button className="bg-white text-blue-700 w-full mt-3 py-1 rounded-lg">
              Pay Now
            </button>
          </div>

        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">

          {/* Table */}
          <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm">
                      <DashboardTable/>
            </div>

            {/* Map */}
            <div className="relative h-[160px] rounded-xl overflow-hidden bg-[url('https://maps.gstatic.com/tactile/basepage/pegman_sherlock.png')] bg-cover">
              <div className="absolute bottom-2 left-2 text-white">
                <p className="font-bold">International Student Office</p>
                <p className="text-xs">Building C, Room 204</p>
              </div>
            </div>

          </div>
      </main>
    </div>
  );
}