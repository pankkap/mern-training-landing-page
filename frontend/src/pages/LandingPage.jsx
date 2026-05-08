import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import SocialProof from '../components/SocialProof'
import TechStack from '../components/TechStack'
import TechnologiesSection from '../components/TechnologiesSection'
import Benefits from '../components/Benefits'
import Curriculum from '../components/Curriculum'
import Testimonials from '../components/Testimonials'
import Instructor from '../components/Instructor'
import UrgencySection from '../components/UrgencySection'
import Pricing from '../components/Pricing'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import ModalForm from '../components/ModalForm'
import CTAButton from '../components/CTAButton'

function LandingPage() {
  const [openModal, setOpenModal] = useState(false)
  const [resumePayment, setResumePayment] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!location.state?.openPaymentUpdate) {
      return
    }

    const pendingRegistrationId = localStorage.getItem('pending_registration_id')

    if (pendingRegistrationId) {
      setResumePayment({ registrationId: pendingRegistrationId })
      setOpenModal(true)
    }

    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

  const openRegistrationModal = () => {
    setResumePayment(null)
    setOpenModal(true)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar onReserve={openRegistrationModal} />
      <Hero onReserve={openRegistrationModal} />
      <SocialProof />
      <UrgencySection />
      <TechStack />
      <TechnologiesSection />
      <Benefits />
      <Curriculum />
      <Instructor />
      <Testimonials />
      <Pricing onReserve={openRegistrationModal} />
      <FAQ />
      <Footer />

      {/* mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white px-4 py-3 md:hidden">
        <CTAButton label="Register Now — Rs 7,500" onClick={openRegistrationModal} className="w-full" />
      </div>

      {/* desktop floating CTA */}
      <div className="fixed bottom-6 right-6 z-30 hidden md:block">
        <CTAButton label="Reserve Seat" onClick={openRegistrationModal} className="px-7 py-3.5 shadow-xl" />
      </div>

      <ModalForm open={openModal} onClose={() => setOpenModal(false)} resumePayment={resumePayment} />
    </div>
  )
}

export default LandingPage
