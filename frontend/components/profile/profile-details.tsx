"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "(123) 456-7890",
  avatar: "/placeholder.svg?height=100&width=100",
}

export function ProfileDetails() {
  const [user, setUser] = useState(userData)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(userData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUser(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(user)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Manage your personal information and how it is displayed on your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" type="button" disabled={!isEditing}>
                Change Photo
              </Button>
            </div>

            <div className="flex-grow space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                disabled={!isEditing}
                placeholder={isEditing ? "Enter current password" : "••••••••"}
              />
            </div>

            {isEditing && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" name="newPassword" type="password" placeholder="Enter new password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              </>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          )}
        </form>
      </CardContent>
      {!isEditing && (
        <CardFooter>
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </CardFooter>
      )}
    </Card>
  )
}
