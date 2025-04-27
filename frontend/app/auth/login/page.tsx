import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
