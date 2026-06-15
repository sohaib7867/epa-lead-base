import Header from './components/Header';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';
import PaymentStatus from './components/PaymentStatus';
import './App.css';

function App() {
  // Read ?payment=success or ?payment=cancelled from the URL
  const params = new URLSearchParams(window.location.search);
  const paymentStatus = params.get('payment'); // "success" | "cancelled" | null

  return (
    <div className="app" id="app">
      <Header />

      {paymentStatus ? (
        // Show confirmation/cancellation screen after Stripe redirects back
        <PaymentStatus status={paymentStatus} />
      ) : (
        // Show normal booking form
        <BookingForm />
      )}

      <Footer />
    </div>
  );
}

export default App;
