"use client"

import { useState, useContext, useEffect } from "react"
import { toast } from "react-toastify"
import { FaUser, FaCamera, FaKey, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"
import { AuthContext } from "../../contexts/AuthContext.js"
import api from "../../utils/api.js"
import "./ProfilePage.css"

const ProfilePage = () => {
  const { currentUser, updateProfile } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        full_name: currentUser.full_name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
      })

      if (currentUser.avatar_url) {
        setAvatarPreview(currentUser.avatar_url)
      }
    }
  }, [currentUser])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      [name]: value,
    })
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB")
        return
      }

      if (!file.type.match("image.*")) {
        toast.error("Vui lòng chọn file hình ảnh")
        return
      }

      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  const validateProfileForm = () => {
    const newErrors = {}

    if (!profileData.full_name.trim()) {
      newErrors.full_name = "Vui lòng nhập họ tên"
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (profileData.phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(profileData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors = {}

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại"
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới"
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự"
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const handleProfileSubmit = async (e) => {
  e.preventDefault()

  if (!validateProfileForm()) {
    return
  }

  setLoading(true)

  try {
    // Nếu có file ảnh đại diện mới, tải lên trước
    let avatarUrl = currentUser.avatar_url

    if (avatarFile) {
      const formData = new FormData()
      formData.append("avatar", avatarFile)

      try {
        console.log("Uploading avatar...")
        const uploadResponse = await api.post("/users/upload-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        console.log("Upload response:", uploadResponse.data)
        avatarUrl = uploadResponse.data.avatar_url
        console.log("avatarUrl from API:", avatarUrl)

        // ✅ Gán lại preview để hiển thị đúng ảnh mới
        setAvatarPreview(avatarUrl)
      } catch (uploadError) {
        console.error("Error uploading avatar:", uploadError)
        const errorMessage = uploadError.response?.data?.message || "Không thể tải lên ảnh đại diện"
        toast.error(errorMessage)
        setLoading(false)
        return
      }
    }

    // Cập nhật thông tin hồ sơ
    console.log("Updating profile with avatar URL:", avatarUrl)
    const updatedProfile = await updateProfile({
      ...profileData,
      avatar_url: avatarUrl,
    })
    
    setAvatarFile(null)
    setAvatarPreview(updatedProfile.avatar_url)
    toast.success("Cập nhật hồ sơ thành công")
  } catch (error) {
    console.error("Error updating profile:", error)
    const errorMessage = error.response?.data?.message || "Cập nhật hồ sơ thất bại"
    toast.error(errorMessage)
  } finally {
    setLoading(false)
  }
}


  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    setLoading(true)

    try {
      await api.put("/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      // Xóa form sau khi đổi mật khẩu thành công
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast.success("Đổi mật khẩu thành công")
    } catch (error) {
      console.error("Error changing password:", error)
      const errorMessage = error.response?.data?.message || "Đổi mật khẩu thất bại"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading">Đang tải...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                {avatarPreview || currentUser.avatar_url ? (
                <img
                  src={
                    avatarPreview
                      ? avatarPreview
                      : `http://localhost:5000${encodeURI(currentUser.avatar_url)}`
                  }
                  alt={currentUser.full_name}
                  className="rounded-full w-28 h-28 object-cover border-2 border-white shadow-md"
                />
              ) : (
                <FaUser className="default-avatar" />
              )}
                <label className="avatar-upload-label" htmlFor="avatar-upload">
                  <FaCamera />
                  <span>Thay đổi</span>
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="avatar-upload-input"
                />
              </div>
              <h3 className="profile-name">{currentUser.full_name}</h3>
              <p className="profile-email">{currentUser.email}</p>
            </div>

            <div className="profile-menu">
              <button
                className={`profile-menu-item ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <FaUser />
                <span>Thông tin cá nhân</span>
              </button>
              <button
                className={`profile-menu-item ${activeTab === "password" ? "active" : ""}`}
                onClick={() => setActiveTab("password")}
              >
                <FaKey />
                <span>Đổi mật khẩu</span>
              </button>
            </div>
          </div>

          <div className="profile-content">
            {activeTab === "profile" && (
              <div className="profile-section">
                <h2 className="section-title">Thông tin cá nhân</h2>
                <form className="profile-form" onSubmit={handleProfileSubmit}>
                  <div className="form-group">
                    <label htmlFor="full_name">
                      <FaUser />
                      Họ tên
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={profileData.full_name}
                      onChange={handleProfileChange}
                      className={errors.full_name ? "form-control error" : "form-control"}
                    />
                    {errors.full_name && <div className="error-message">{errors.full_name}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <FaEnvelope />
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={errors.email ? "form-control error" : "form-control"}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <FaPhone />
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className={errors.phone ? "form-control error" : "form-control"}
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">
                      <FaMapMarkerAlt />
                      Địa chỉ
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "password" && (
              <div className="profile-section">
                <h2 className="section-title">Đổi mật khẩu</h2>
                <form className="profile-form" onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={errors.currentPassword ? "form-control error" : "form-control"}
                    />
                    {errors.currentPassword && <div className="error-message">{errors.currentPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">Mật khẩu mới</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={errors.newPassword ? "form-control error" : "form-control"}
                    />
                    {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={errors.confirmPassword ? "form-control error" : "form-control"}
                    />
                    {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                  </div>

                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? "Đang lưu..." : "Đổi mật khẩu"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
