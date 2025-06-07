
const Map = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Visit Our Store
          </h2>
          <p className="text-xl text-slate-600">
            Find us at our convenient location for all your construction material needs
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-500">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3570.123456789!2d94.1157911!3d27.2537697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDE1JzEzLjYiTiA5NMKwMDYnNTYuOCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="hover:scale-105 transition-transform duration-700"
              title="M.R. STORE Location"
            ></iframe>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
          
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl hover:bg-slate-100 transition-colors duration-300">
              <h3 className="font-semibold text-slate-900 mb-2">Store Address</h3>
              <p className="text-slate-600">
                Latitude: 27.2537697<br />
                Longitude: 94.1157911
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl hover:bg-slate-100 transition-colors duration-300">
              <h3 className="font-semibold text-slate-900 mb-2">Business Hours</h3>
              <p className="text-slate-600">
                Monday - Saturday: 8:00 AM - 8:00 PM<br />
                Sunday: 9:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
