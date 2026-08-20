import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  image: string;
  category: string;
  attendees: number;
  price: number;
  description: string;
  organizer: string;
  tags: string[];
}

const EventsShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const events: Event[] = [
    {
      id: 1,
      title: 'Tech Innovation Summit 2024',
      date: new Date(2024, 11, 15),
      time: '9:00 AM - 5:00 PM',
      location: 'Convention Center, SF',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
      category: 'technology',
      attendees: 1200,
      price: 299,
      description: 'Join industry leaders for cutting-edge technology discussions.',
      organizer: 'Tech Leaders Association',
      tags: ['AI', 'Blockchain', 'Cloud']
    },
    {
      id: 2,
      title: 'Music Festival Under the Stars',
      date: new Date(2024, 10, 22),
      time: '6:00 PM - 12:00 AM',
      location: 'Central Park, NY',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop',
      category: 'music',
      attendees: 5000,
      price: 89,
      description: 'Experience an unforgettable night with top artists.',
      organizer: 'Music Events Inc.',
      tags: ['Live Music', 'Festival']
    },
    {
      id: 3,
      title: 'Startup Pitch Competition',
      date: new Date(2024, 11, 8),
      time: '2:00 PM - 6:00 PM',
      location: 'Innovation Hub, Austin',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
      category: 'business',
      attendees: 300,
      price: 0,
      description: 'Watch startups pitch to top investors for funding.',
      organizer: 'Venture Capital Network',
      tags: ['Pitching', 'Funding']
    },
    {
      id: 4,
      title: 'Yoga & Wellness Retreat',
      date: new Date(2024, 10, 30),
      time: '7:00 AM - 4:00 PM',
      location: 'Serenity Resort, CO',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop',
      category: 'wellness',
      attendees: 50,
      price: 149,
      description: 'Rejuvenate your mind and body with yoga sessions.',
      organizer: 'Wellness Collective',
      tags: ['Yoga', 'Meditation']
    },
    {
      id: 5,
      title: 'Art Exhibition Opening',
      date: new Date(2024, 11, 5),
      time: '6:00 PM - 9:00 PM',
      location: 'Modern Art Museum, Chicago',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=200&fit=crop',
      category: 'art',
      attendees: 200,
      price: 25,
      description: 'Exclusive preview of contemporary art from artists.',
      organizer: 'Art Society',
      tags: ['Contemporary', 'Exhibition']
    },
    {
      id: 6,
      title: 'Food & Wine Festival',
      date: new Date(2024, 11, 12),
      time: '11:00 AM - 8:00 PM',
      location: 'Waterfront Plaza, Seattle',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop',
      category: 'food',
      attendees: 1500,
      price: 75,
      description: 'Taste exquisite dishes and fine wines from top chefs.',
      organizer: 'Culinary Experiences',
      tags: ['Gourmet', 'Wine']
    },
    {
      id: 7,
      title: 'Digital Marketing Conference',
      date: new Date(2024, 11, 18),
      time: '10:00 AM - 4:00 PM',
      location: 'Business Center, Boston',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop',
      category: 'business',
      attendees: 800,
      price: 199,
      description: 'Learn latest digital marketing strategies and trends.',
      organizer: 'Marketing Pros',
      tags: ['SEO', 'Social Media']
    },
    {
      id: 8,
      title: 'Charity Run for Education',
      date: new Date(2024, 10, 28),
      time: '8:00 AM - 11:00 AM',
      location: 'City Park, Denver',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
      category: 'sports',
      attendees: 1200,
      price: 35,
      description: 'Support education through our annual charity run event.',
      organizer: 'Education Foundation',
      tags: ['Running', 'Charity']
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🎪', count: events.length },
    { id: 'technology', name: 'Tech', icon: '💻', count: events.filter(e => e.category === 'technology').length },
    { id: 'music', name: 'Music', icon: '🎵', count: events.filter(e => e.category === 'music').length },
    { id: 'business', name: 'Business', icon: '💼', count: events.filter(e => e.category === 'business').length },
    { id: 'wellness', name: 'Wellness', icon: '🧘', count: events.filter(e => e.category === 'wellness').length },
    { id: 'art', name: 'Art', icon: '🎨', count: events.filter(e => e.category === 'art').length },
    { id: 'food', name: 'Food', icon: '🍴', count: events.filter(e => e.category === 'food').length },
    { id: 'sports', name: 'Sports', icon: '⚽', count: events.filter(e => e.category === 'sports').length }
  ];

  const toggleFavorite = (eventId: number) => {
    setFavorites(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGridCols = () => {
    return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <motion.header
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
          Discover Events
        </h1>
        <p className="text-base text-gray-600">
          Find and join exciting events happening near you
        </p>
      </motion.header>

      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm text-sm sm:text-base placeholder-gray-400 transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search events"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium border ${selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-md border-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Filter by ${category.name}`}
            >
              <span className="mr-2">{category.icon}</span>
              <span>{category.name}</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
                }`}>
                {category.count}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        className={getGridCols()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <AnimatePresence>
          {filteredEvents.length === 0 ? (
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-4xl mb-4 block">🔍</span>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or category</p>
            </motion.div>
          ) : (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                    {formatDate(event.date)}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                    {event.price === 0 ? 'Free' : `₹${event.price}`}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(event.id);
                    }}
                    className="absolute bottom-3 right-3 p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    aria-label={favorites.includes(event.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <span className={`text-lg ${favorites.includes(event.id) ? 'text-red-500' : 'text-gray-400'}`}>
                      {favorites.includes(event.id) ? '❤️' : '🤍'}
                    </span>
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      👥 {event.attendees}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-1.5">⏰</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-1.5">📍</span>
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {event.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{event.tags.length - 2}
                      </span>
                    )}
                  </div>

                  <motion.button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={`Get tickets for ${event.title}`}
                  >
                    Get Tickets
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="text-center mt-8 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredEvents.length} of {events.length} events
        </p>
        <motion.button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Load More
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EventsShowcase;
