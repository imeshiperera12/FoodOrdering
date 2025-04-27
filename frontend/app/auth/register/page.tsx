import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
