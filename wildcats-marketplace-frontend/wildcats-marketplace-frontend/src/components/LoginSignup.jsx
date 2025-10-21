import React, {useState} from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const LoginSignup = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName:'',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const [touched, setTouched] = useState({});

  const [isSignupMode, setIsSignupMode] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'fullName':
        if (isSignupMode && !value.trim()) return 'Full Name is required';
        const words = value.trim().split(/\s+/);
        if (words.length < 2) return 'Please enter at least first and last name';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Full Name can only contain letters and spaces';
        return '';

      case 'userName':
        if (!value.trim()) return 'Username is required';
        if (value.length < 3 || value.length > 15) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_.@-]+$/.test(value)) return 'Only letters, numbers, _, ., -, @ are allowed';

        return '';

      case 'email':
        if (isSignupMode && !value.trim()) return 'Email is required';
        const emailRegex = /^[A-Za-z0-9._%+-]+@cit\.edu$/;
        if (isSignupMode && !emailRegex.test(value)) return 'Invalid email address';
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';

      case 'confirmPassword':
        if (isSignupMode && !value) return 'Please confirm your password';
        if (isSignupMode && value !== formData.password) return 'Passwords do not match';
        return '';

      default:
        return '';
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleFieldNameBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    const handleError = validateField(fieldName, formData[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: handleError }));
  };

  // Toggle between login and signup
  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
  };

  // Validate whole Form
  const validateForm = () => {
    const fieldsToValidate = isSignupMode
      ? ['fullName', 'userName', 'email', 'password', 'confirmPassword']
      : ['userName', 'password'];

    const newErrors = {};
    let isValid = true;

    fieldsToValidate.forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    const newTouched = {};
    fieldsToValidate.forEach(fieldName => {
      newTouched[fieldName] = true;
    });
    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(newErrors);

    if (!isValid) {
      console.log('❌ Form has errors, stopping submission');
      alert('Please fix the errors before submitting');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    console.log('🚀 Validating form before submission...');

    // Validate all fields
    const isValid = validateForm();
    if (!isValid) return;

    console.log('✅ Form is valid, proceeding with submission');

    // Start submission
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert(`${isSignupMode ? 'Registration' : 'Login'} successful!`);

      navigate('/home', {
        state: {
          isNewUser: isSignupMode,
          username: formData.userName
        }
      });


    } catch (error) {
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-w-full h-full bg-[#FFF7D4] rounded-md'>
      <div className={`flex flex-col items-center justify-center p-3 ${isSignupMode ? 'gap-1' : 'gap-3'}`}>

        {/* Form Title */}
        <h2 className={`text-4xl font-extrabold font-serif text-black my-5 ${isSignupMode ? "" : "mb-15"}`}>
          {isSignupMode ? 'SIGN UP' : 'LOGIN'}
        </h2>

        {/* Full Name field - only visible in signup mode */}
        {isSignupMode && (
          <div className="w-full flex items-center justify-center mb-2.5">
            <div className="relative w-[90%]">
              <div className='flex items-center relative'>
                {/* Icon */}
                <img
                  src={assets.user_icon}
                  alt="user icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                />

                {/* Input */}
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onBlur={() => handleFieldNameBlur('fullName')}
                  placeholder="Full Name"
                  className={`text-sm font-semibold font-mono w-full p-2.5 pl-10 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent
                    ${errors.fullName && touched.fullName ? 'border-red-500 focus:ring-red-500'
                    : 'focus:ring-blue-500'}
                    `}
                />
              </div>
              {/* Error message */}
              {errors.fullName && touched.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>
          </div>
        )}

        {/* Username field - always visible */}
        <div className="w-full flex items-center justify-center mb-2.5">
          <div className="relative w-[90%]">
            <div className='flex items-center relative'>
              {/* Icon */}
              <img
                src={assets.user_icon}
                alt="user icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              />

              {/* Input */}
              <input
                type="text"
                onChange={(e) => handleInputChange('userName', e.target.value)}
                onBlur={() => handleFieldNameBlur('userName')}
                placeholder="Username"
                className={`text-sm font-semibold font-mono w-full p-2.5 pl-10 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent
                  {errors.userName && touched.userName ? 'border-red-500 focus:ring-red-500'
                    : 'focus:ring-blue-500'}
                    `}
              />
            </div>
            {/* Error message */}
            {errors.userName && touched.userName && (
                <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
              )}
          </div>
        </div>

        {/* Email field - only visible in signup mode */}
        {isSignupMode && (
          <div className="w-full flex items-center justify-center mb-2.5">
            <div className="relative w-[90%]">
              <div className='flex items-center relative'>
                {/* Icon */}
                <img
                  src={assets.email_icon}
                  alt="email icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                />

                {/* Input */}
                <input
                  type="email"
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleFieldNameBlur('email')}
                  placeholder="Email"
                  className={`text-sm font-semibold font-mono w-full p-2.5 pl-10 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent
                  {errors.email && touched.email ? 'border-red-500 focus:ring-red-500'
                    : 'focus:ring-blue-500'}
                    `}
                />
              </div>
              {/* Error message */}
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        )}

        {/* Password field - always visible */}
        <div className="w-full flex items-center justify-center mb-2.5">
          <div className="relative w-[90%]">
            <div className='flex items-center relative'>
              {/* Icon */}
              <img
                src={assets.lock_icon}
                alt="lock icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              />

              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => handleFieldNameBlur('password')}
                placeholder="Password"
                className={`text-sm font-semibold font-mono w-full p-2.5 pl-10 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent
                  ${errors.password && touched.password ? 'border-red-500 focus:ring-red-500'
                    : 'focus:ring-blue-500'}
                `}
              />

              {/* Password visibility icon */}
              <img
                src={showPassword ? assets.pw_visible_icon : assets.pw_hidden_icon}
                alt="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer"
              />
            </div>
            {/* Error message */}
            {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}

          </div>
        </div>

        {/* Confirm Password field - only visible in signup mode */}
        {isSignupMode && (
          <div className="w-full flex items-center justify-center mb-2.5">
            <div className={`relative w-[90%]`}>
              <div className='flex items-center relative'>
                {/* Icon */}
                <img
                  src={assets.lock_icon}
                  alt="lock icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => handleFieldNameBlur('confirmPassword')}
                  placeholder="Confirm Password"
                  className={`text-sm font-semibold font-mono w-full p-2.5 pl-10 rounded-md bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31800] focus:border-transparent
                    ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500 focus:ring-red-500'
                      : 'focus:ring-blue-500'}
                  `}
                />

                {/* Confirm password visibility icon */}
                <img
                  src={showConfirmPassword ? assets.pw_visible_icon : assets.pw_hidden_icon}
                  alt="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer"
                />
              </div>
              {/* Error message */}
              {errors.confirmPassword && touched.confirmPassword && (
                <p className={`text-red-500 text-xs mt-1 `}>{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        )}


      {/* Submit buttons with dynamic text */}
    <div  className={`flex items-center justify-around w-full ${isSignupMode ? '' : 'mt-5'}`}>
        <button
          disabled={isSubmitting}
          onClick={isSignupMode ? handleSubmit : toggleMode}
          className={`w-[40%] ml-1/2 mb-4 ${isSignupMode? "!bg-[#A31800] hover:!bg-[#801300]" : "!bg-[#BFB58F]"} text-white p-2 rounded-md transition duration-300 font-medium`}>
          Sign up
        </button>
        <button
          disabled={isSubmitting}
          onClick={isSignupMode ? toggleMode : handleSubmit}
          className={`w-[40%] mr-1/2 mb-4 ${isSignupMode? "!bg-[#BFB58F]" : "!bg-[#A31800] hover:!bg-[#801300]"} text-white p-2 rounded-md  transition duration-300 font-medium`}>
          Login
        </button>
      </div>

      </div>
    </div>
  )
};

export default LoginSignup