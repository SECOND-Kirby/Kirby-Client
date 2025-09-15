import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { authService } from '@/services/authService';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const SignUpScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [duplicateChecking, setDuplicateChecking] = useState(false);
    const [usernameChecked, setUsernameChecked] = useState(false);

    // 필드별 에러 상태 (백엔드 필드명과 일치)
    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
        passwordConfirm: ''
    });

    const formatPhoneNumber = (text: string): string => {
        const numbers = text.replace(/[^\d]/g, '');

        if (numbers.length > 11) {
            return phoneNumber;
        }

        if (numbers.length <= 3) {
            return numbers;
        } else if (numbers.length <= 7) {
            return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
            return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handlePhoneNumberChange = (text: string) => {
        const formatted = formatPhoneNumber(text);
        setPhoneNumber(formatted);
        if (fieldErrors.phoneNumber) {
            setFieldErrors(prev => ({ ...prev, phoneNumber: '' }));
        }
    };

    const handleUsernameChange = (text: string) => {
        setUsername(text);
        setUsernameChecked(false);
        if (fieldErrors.username) {
            setFieldErrors(prev => ({ ...prev, username: '' }));
        }
    };

    const handleNameChange = (text: string) => {
        setName(text);
        if (fieldErrors.name) {
            setFieldErrors(prev => ({ ...prev, name: '' }));
        }
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (fieldErrors.email) {
            setFieldErrors(prev => ({ ...prev, email: '' }));
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (fieldErrors.password) {
            setFieldErrors(prev => ({ ...prev, password: '' }));
        }
    };

    const handlePasswordConfirmChange = (text: string) => {
        setPasswordConfirm(text);
        if (fieldErrors.passwordConfirm) {
            setFieldErrors(prev => ({ ...prev, passwordConfirm: '' }));
        }
    };

    const validateFields = () => {
        const errors = {
            name: '',
            email: '',
            phoneNumber: '',
            username: '',
            password: '',
            passwordConfirm: ''
        };

        let hasError = false;

        if (!name.trim()) {
            errors.name = '이름을 입력해주세요.';
            hasError = true;
        }

        if (!email.trim()) {
            errors.email = '이메일을 입력해주세요.';
            hasError = true;
        } else {
            // 이메일 형식 검증
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                errors.email = '올바른 이메일 형식을 입력해주세요.';
                hasError = true;
            }
        }

        if (!phoneNumber.trim()) {
            errors.phoneNumber = '전화번호를 입력해주세요.';
            hasError = true;
        }

        if (!username.trim()) {
            errors.username = '아이디를 입력해주세요.';
            hasError = true;
        }

        if (!password.trim()) {
            errors.password = '비밀번호를 입력해주세요.';
            hasError = true;
        }

        if (!passwordConfirm.trim()) {
            errors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
            hasError = true;
        } else if (password !== passwordConfirm) {
            errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
            hasError = true;
        }

        setFieldErrors(errors);
        return !hasError;
    };

    // 에러 응답 처리 함수
    const handleErrorResponse = (error: any, isSignup: boolean = false) => {
        console.log('에러 처리 시작:', error);

        let errorMessage = isSignup ? '회원가입 중 오류가 발생했습니다.' : '중복 확인 중 오류가 발생했습니다.';
        const newFieldErrors = { ...fieldErrors };
        let hasFieldError = false;

        if (error.response?.data) {
            const errorData = error.response.data;
            console.log('백엔드 에러 데이터:', errorData);

            switch (errorData.code) {
                case 'U002': // 아이디 중복
                    errorMessage = '이미 사용중인 아이디입니다.';
                    if (isSignup) {
                        setUsernameChecked(false);
                        errorMessage += '\n아이디 중복확인을 다시 해주세요.';
                    }
                    break;

                case 'U003': // 이메일 중복
                    errorMessage = '이미 등록된 이메일입니다.\n다른 이메일을 사용해주세요.';
                    newFieldErrors.email = '이미 등록된 이메일입니다.';
                    hasFieldError = true;
                    break;

                case 'U004': // 전화번호 중복
                    errorMessage = '이미 등록된 전화번호입니다.\n다른 전화번호를 사용해주세요.';
                    newFieldErrors.phoneNumber = '이미 등록된 전화번호입니다.';
                    hasFieldError = true;
                    break;

                case 'U006': // 비밀번호 불일치
                    errorMessage = '비밀번호가 일치하지 않습니다.';
                    newFieldErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
                    hasFieldError = true;
                    break;

                case 'E002': // 입력값 검증 실패
                    if (errorData.data && typeof errorData.data === 'object') {
                        const backendErrors = errorData.data as Record<string, string>;
                        console.log('필드별 검증 에러:', backendErrors);

                        // 백엔드 필드별 에러를 프론트엔드 필드 에러에 직접 매핑
                        Object.entries(backendErrors).forEach(([field, message]) => {
                            if (field in newFieldErrors) {
                                newFieldErrors[field as keyof typeof newFieldErrors] = message;
                                hasFieldError = true;
                            }
                        });

                        if (hasFieldError) {
                            errorMessage = '입력값을 확인해주세요.';
                        } else {
                            errorMessage = errorData.message || '입력값이 올바르지 않습니다.';
                        }
                    } else {
                        errorMessage = errorData.message || '입력값이 올바르지 않습니다.';
                    }
                    break;

                default:
                    errorMessage = errorData.message || errorMessage;
                    console.log('처리되지 않은 에러 코드:', errorData.code);
            }
        } else if (error.message) {
            errorMessage = `네트워크 오류가 발생했습니다.\n${error.message}`;
        }

        // 필드 에러가 있으면 업데이트
        if (hasFieldError) {
            setFieldErrors(newFieldErrors);
        }

        return errorMessage;
    };

    const handleDuplicateCheck = async () => {
        if (!username.trim()) {
            setFieldErrors(prev => ({ ...prev, username: '아이디를 입력해주세요.' }));
            return;
        }

        setDuplicateChecking(true);
        // 기존 에러 메시지 초기화
        setFieldErrors(prev => ({ ...prev, username: '' }));

        try {
            const response = await authService.checkUsername(username);
            console.log('중복확인 성공 응답:', response);

            // 성공 = 사용 가능한 아이디
            setUsernameChecked(true);
            Alert.alert('아이디 중복확인', '사용 가능한 아이디입니다.', [
                { text: '확인', style: 'default' }
            ]);

        } catch (error: any) {
            console.log('중복확인 에러 캐치:', error);
            console.log('에러 응답 데이터:', error.response?.data);
            console.log('에러 상태 코드:', error.response?.status);

            setUsernameChecked(false);

            // HTTP 에러 응답인 경우 (409, 400 등)
            if (error.response?.data) {
                const errorData = error.response.data;
                console.log('백엔드 에러 데이터:', errorData);

                let fieldErrorMessage = '';
                let alertMessage = '';

                if (errorData.code === 'U002') {
                    // 아이디 중복 (409 상태)
                    fieldErrorMessage = '이미 사용중인 아이디입니다.';
                    alertMessage = '이미 사용중인 아이디입니다.\n다른 아이디를 입력해주세요.';
                } else if (errorData.code === 'E002' && errorData.data && typeof errorData.data === 'object') {
                    // 입력값 검증 실패 (400 상태)
                    const backendErrors = errorData.data as Record<string, string>;
                    if (backendErrors.username) {
                        fieldErrorMessage = backendErrors.username;
                        alertMessage = backendErrors.username;
                    } else {
                        fieldErrorMessage = '아이디 형식이 올바르지 않습니다.';
                        alertMessage = '아이디 형식이 올바르지 않습니다.';
                    }
                } else {
                    // 기타 백엔드 에러
                    fieldErrorMessage = errorData.message || '아이디 확인 중 오류가 발생했습니다.';
                    alertMessage = errorData.message || '아이디 확인 중 오류가 발생했습니다.';
                }

                // 필드 에러 메시지 설정
                setFieldErrors(prev => ({ ...prev, username: fieldErrorMessage }));

                // Alert 표시
                Alert.alert('아이디 중복확인', alertMessage, [
                    { text: '확인', style: 'cancel' }
                ]);

            } else {
                // 실제 네트워크 에러 (인터넷 연결 끊김 등)
                console.error('실제 네트워크 에러:', error);
                setFieldErrors(prev => ({ ...prev, username: '네트워크 오류가 발생했습니다.' }));
                Alert.alert('오류', '네트워크 오류가 발생했습니다.', [
                    { text: '확인', style: 'default' }
                ]);
            }
        } finally {
            setDuplicateChecking(false);
        }
    };

    const handleSignUp = async () => {
        console.log('회원가입 버튼 클릭됨');

        // 필드 검증
        if (!validateFields()) {
            return;
        }

        // 아이디 중복 확인 체크
        if (!usernameChecked) {
            Alert.alert('알림', '아이디 중복 확인을 해주세요.');
            return;
        }

        console.log('기본 검증 통과, API 호출 진행');
        setLoading(true);

        try {
            const signupData = {
                username: username,
                email: email,
                phoneNumber: phoneNumber,
                name: name,
                password: password,
                passwordConfirm: passwordConfirm
            };

            console.log('API 호출 시작');
            const response = await authService.signup(signupData);

            Alert.alert(
                '회원가입 완료',
                response.message || '회원가입이 완료되었습니다.',
                [
                    {
                        text: '확인',
                        onPress: () => router.replace('/'),
                    },
                ]
            );

        } catch (error: any) {
            console.log('회원가입 에러:', error);

            const errorMessage = handleErrorResponse(error, true);

            Alert.alert('회원가입 실패', errorMessage, [
                { text: '확인', style: 'default' }
            ]);

        } finally {
            setLoading(false);
            console.log('회원가입 처리 완료');
        }
    };

    // 회원가입 버튼 활성화 여부
    const isSignUpDisabled = loading || !usernameChecked;

    return (
        <SafeAreaView style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Ionicons name="chevron-back" size={24} color="#333"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>회원가입</Text>
                <View style={styles.placeholder}/>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollViewContent}
            >
                {/* 환영 메시지 */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeTitle}>환영합니다</Text>
                    <Text style={styles.welcomeSubtitle}>회원가입을 위해 정보를 입력해주세요</Text>
                </View>

                {/* 입력 필드들 */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>이름</Text>
                    <TextInput
                        style={[styles.input, fieldErrors.name && styles.inputError]}
                        placeholder="이름을 입력해주세요"
                        placeholderTextColor="#999"
                        value={name}
                        onChangeText={handleNameChange}
                        autoCapitalize="words"
                        maxLength={100}
                    />
                    {fieldErrors.name ? <Text style={styles.errorText}>{fieldErrors.name}</Text> : null}

                    <Text style={styles.inputLabel}>이메일</Text>
                    <TextInput
                        style={[styles.input, fieldErrors.email && styles.inputError]}
                        placeholder="example@email.com"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={handleEmailChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={50}
                    />
                    {fieldErrors.email ? <Text style={styles.errorText}>{fieldErrors.email}</Text> : null}

                    <Text style={styles.inputLabel}>전화번호</Text>
                    <TextInput
                        style={[styles.input, fieldErrors.phoneNumber && styles.inputError]}
                        placeholder="010-0000-0000"
                        placeholderTextColor="#999"
                        value={phoneNumber}
                        onChangeText={handlePhoneNumberChange}
                        keyboardType="number-pad"
                        maxLength={13}
                    />
                    {fieldErrors.phoneNumber ? <Text style={styles.errorText}>{fieldErrors.phoneNumber}</Text> : null}

                    <Text style={styles.inputLabel}>아이디</Text>
                    <View style={styles.usernameContainer}>
                        <TextInput
                            style={[styles.input, styles.usernameInput, fieldErrors.username && styles.inputError]}
                            placeholder="6자 이상, 영문/숫자만"
                            placeholderTextColor="#999"
                            value={username}
                            onChangeText={handleUsernameChange}
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={20}
                        />
                        <TouchableOpacity
                            style={[
                                styles.duplicateButton,
                                duplicateChecking && styles.duplicateButtonDisabled,
                                usernameChecked && styles.duplicateButtonChecked
                            ]}
                            onPress={handleDuplicateCheck}
                            disabled={duplicateChecking}
                        >
                            <Text style={[
                                styles.duplicateButtonText,
                                usernameChecked && styles.duplicateButtonTextChecked
                            ]}>
                                {duplicateChecking ? '확인중...' : usernameChecked ? '확인완료' : '중복확인'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {fieldErrors.username ? <Text style={styles.errorText}>{fieldErrors.username}</Text> : null}

                    <Text style={styles.inputLabel}>비밀번호</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={[styles.input, styles.passwordInput, fieldErrors.password && styles.inputError]}
                            placeholder="비밀번호를 입력해주세요"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={handlePasswordChange}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={20}
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? "eye" : "eye-off"}
                                size={20}
                                color="#999"
                            />
                        </TouchableOpacity>
                    </View>
                    {fieldErrors.password ? <Text style={styles.errorText}>{fieldErrors.password}</Text> : null}
                    <Text style={styles.passwordHint}>
                        8자 이상 20자 이하, 영문자/숫자/특수문자 모두 포함
                    </Text>

                    <Text style={styles.inputLabel}>비밀번호확인</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={[styles.input, styles.passwordInput, fieldErrors.passwordConfirm && styles.inputError]}
                            placeholder="비밀번호를 다시 입력해주세요"
                            placeholderTextColor="#999"
                            value={passwordConfirm}
                            onChangeText={handlePasswordConfirmChange}
                            secureTextEntry={!showPasswordConfirm}
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={20}
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        >
                            <Ionicons
                                name={showPasswordConfirm ? "eye" : "eye-off"}
                                size={20}
                                color="#999"
                            />
                        </TouchableOpacity>
                    </View>
                    {fieldErrors.passwordConfirm ? <Text style={styles.errorText}>{fieldErrors.passwordConfirm}</Text> : null}
                </View>

                {/* 회원가입 버튼 */}
                <TouchableOpacity
                    style={[
                        styles.signUpButton,
                        isSignUpDisabled && styles.signUpButtonDisabled
                    ]}
                    onPress={handleSignUp}
                    disabled={isSignUpDisabled}
                >
                    <Text style={[
                        styles.signUpButtonText,
                        isSignUpDisabled && styles.signUpButtonTextDisabled
                    ]}>
                        {loading ? '회원가입 중...' : '회원가입'}
                    </Text>
                </TouchableOpacity>

                {!usernameChecked && (
                    <Text style={styles.warningText}>
                        아이디 중복 확인을 완료해주세요
                    </Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    placeholder: {
        width: 34,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 50,
    },
    welcomeContainer: {
        alignItems: 'flex-start',
        paddingHorizontal: 30,
        paddingVertical: 30,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    inputContainer: {
        paddingHorizontal: 30,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 20,
    },
    input: {
        height: 50,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    inputError: {
        borderColor: '#ff4444',
        backgroundColor: '#fff5f5',
    },
    errorText: {
        fontSize: 12,
        color: '#ff4444',
        marginTop: 4,
        marginLeft: 4,
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    usernameInput: {
        flex: 1,
        marginRight: 10,
    },
    duplicateButton: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 16,
        paddingVertical: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    duplicateButtonDisabled: {
        backgroundColor: '#e0e0e0',
        opacity: 0.6,
    },
    duplicateButtonChecked: {
        backgroundColor: '#E7FF65',
        borderColor: '#d0e055',
    },
    duplicateButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    duplicateButtonTextChecked: {
        color: '#333',
        fontWeight: 'bold',
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeButton: {
        position: 'absolute',
        right: 15,
        top: '35%',
        transform: [{translateY: -10}],
        padding: 5,
    },
    passwordHint: {
        fontSize: 12,
        color: '#999',
        marginTop: 8,
        lineHeight: 16,
    },
    signUpButton: {
        backgroundColor: '#E7FF65',
        borderRadius: 12,
        paddingVertical: 16,
        marginHorizontal: 30,
        marginVertical: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    signUpButtonDisabled: {
        backgroundColor: '#f0f0f0',
        opacity: 0.6,
        shadowOpacity: 0,
        elevation: 0,
    },
    signUpButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    signUpButtonTextDisabled: {
        color: '#999',
    },
    warningText: {
        fontSize: 14,
        color: '#ff6b6b',
        textAlign: 'center',
        marginTop: -20,
        marginBottom: 20,
        fontWeight: '500',
    },
});

export default SignUpScreen;