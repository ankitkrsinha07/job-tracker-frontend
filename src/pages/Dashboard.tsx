import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'
import ApplicationCard from '../components/ApplicationCard'

interface Application {
  id: number
  company: string
  role: string
  status: string
  appliedDate: string
  notes?: string
  jobUrl?: string
  salary?: string
}

interface Stats {
  stats: Record<string, number>
  total: number
}

async function fetchApplications(): Promise<Application[]> {
  const response = await api.get('/applications')
  return response.data
}

async function fetchStats(): Promise<Stats> {
  const response = await api.get('/applications/stats')
  return response.data
}

const statusFilters = ['all', 'applied', 'interview', 'rejected', 'offer']

const statCards = [
  {
    key: 'applied',
    label: 'Applied',
    icon: '📤',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    number: 'text-blue-600'
  },
  {
    key: 'interview',
    label: 'Interview',
    icon: '🎯',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    number: 'text-yellow-600'
  },
  {
    key: 'rejected',
    label: 'Rejected',
    icon: '❌',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    number: 'text-red-600'
  },
  {
    key: 'offer',
    label: 'Offer',
    icon: '🎉',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    number: 'text-green-600'
  }
]

function Dashboard() {
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

  const {
    data: applications = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
    enabled: isLoggedIn
    // only fetch if logged in
  })

  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    enabled: isLoggedIn
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/applications/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    }
  })

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('Delete this application?')) {
      deleteMutation.mutate(id)
    }
  }, [deleteMutation])

  const handleEdit = useCallback((id: number) => {
    navigate(`/edit/${id}`)
  }, [navigate])

  // Filter and search
  const filteredApplications = useMemo(() => {
    return applications
      .filter(app =>
        activeFilter === 'all' || app.status === activeFilter
      )
      .filter(app =>
        app.company.toLowerCase().includes(search.toLowerCase()) ||
        app.role.toLowerCase().includes(search.toLowerCase())
      )
  }, [applications, activeFilter, search])

  // Not logged in — show landing
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50
                      via-white to-purple-50 flex items-center
                      justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="text-7xl mb-6">💼</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Job Hunt
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Stay organised. Never lose track of an application.
            Know exactly where you stand at every company.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register"
              className="px-6 py-3 bg-blue-600 text-white
                         rounded-xl font-medium no-underline
                         hover:bg-blue-700 transition-colors
                         shadow-lg shadow-blue-200">
              Get Started Free
            </Link>
            <Link to="/login"
              className="px-6 py-3 border-2 border-gray-300
                         text-gray-700 rounded-xl font-medium
                         no-underline hover:border-gray-400
                         transition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600
                        border-t-transparent rounded-full
                        animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading your applications...</p>
      </div>
    </div>
  )

  if (isError) return (
    <div className="p-10 text-center text-red-500">
      {(error as any)?.message || 'Something went wrong'}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Good day, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Here is your job search overview
            </p>
          </div>
          <Link to="/add"
            className="flex items-center gap-2 px-5 py-2.5
                       bg-blue-600 text-white rounded-xl
                       no-underline font-medium hover:bg-blue-700
                       transition-colors shadow-lg shadow-blue-200
                       text-sm">
            <span>+</span>
            <span>Add Application</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(card => (
            <div
              key={card.key}
              onClick={() => setActiveFilter(
                activeFilter === card.key ? 'all' : card.key
              )}
              className={`${card.bg} border ${card.border}
                          rounded-xl p-5 cursor-pointer
                          transition-all duration-200
                          hover:shadow-md
                          ${activeFilter === card.key
                            ? 'ring-2 ring-offset-2 ring-blue-400 shadow-md'
                            : ''
                          }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className={`text-3xl font-bold ${card.number}`}>
                  {statsData?.stats[card.key] || 0}
                </span>
              </div>
              <p className={`text-sm font-medium ${card.text}`}>
                {card.label}
              </p>
            </div>
          ))}
        </div>

        {/* Total banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600
                        rounded-xl p-4 mb-8 flex items-center
                        justify-between">
          <div className="text-white">
            <p className="text-sm opacity-80">Total Applications</p>
            <p className="text-2xl font-bold">
              {statsData?.total || 0}
            </p>
          </div>
          <div className="text-white opacity-80 text-4xl">📊</div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-gray-200
                        p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search company or role..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200
                           rounded-lg text-sm outline-none
                           focus:border-blue-500 focus:ring-2
                           focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium
                             capitalize transition-colors border-none
                             cursor-pointer ${
                               activeFilter === filter
                                 ? 'bg-blue-600 text-white'
                                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                             }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {activeFilter === 'all' ? 'All Applications' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Applications`}
            </h2>
            <span className="text-sm text-gray-400">
              {filteredApplications.length} result{filteredApplications.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200
                            border-dashed p-16 text-center">
              <div className="text-5xl mb-4">
                {search || activeFilter !== 'all' ? '🔍' : '📋'}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {search || activeFilter !== 'all'
                  ? 'No matching applications'
                  : 'No applications yet'
                }
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {search || activeFilter !== 'all'
                  ? 'Try a different search or filter'
                  : 'Add your first job application to get started'
                }
              </p>
              {!search && activeFilter === 'all' && (
                <Link to="/add"
                  className="inline-flex items-center gap-2 px-5 py-2.5
                             bg-blue-600 text-white rounded-xl
                             no-underline font-medium text-sm
                             hover:bg-blue-700 transition-colors">
                  + Add Application
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredApplications.map(app => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard
