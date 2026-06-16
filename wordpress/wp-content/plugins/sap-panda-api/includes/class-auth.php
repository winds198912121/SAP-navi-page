<?php
/**
 * JWT Authentication for SAP Panda API
 *
 * @package SAP_Panda_API
 */

class SAP_Panda_Auth {

    public function register_routes() {
        register_rest_route('sap/v1', '/auth/login', [
            'methods'             => 'POST',
            'callback'            => [$this, 'login'],
            'permission_callback' => '__return_true',
        ]);
        register_rest_route('sap/v1', '/auth/register', [
            'methods'             => 'POST',
            'callback'            => [$this, 'register'],
            'permission_callback' => '__return_true',
        ]);
        register_rest_route('sap/v1', '/auth/validate', [
            'methods'             => 'POST',
            'callback'            => [$this, 'validate'],
            'permission_callback' => '__return_true',
        ]);
    }

    /**
     * Generate JWT token
     */
    private function generate_token($user_id) {
        $secret = wp_hash('sap_panda_jwt_secret_' . wp_salt());
        $issued = time();
        $expiry = $issued + DAY_IN_SECONDS * 7; // 7 days

        $payload = [
            'iss' => get_bloginfo('url'),
            'iat' => $issued,
            'nbf' => $issued,
            'exp' => $expiry,
            'data' => ['user_id' => $user_id],
        ];

        // Simple HMAC-based JWT
        $header = $this->base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload_enc = $this->base64url_encode(json_encode($payload));
        $signature = $this->base64url_encode(
            hash_hmac('sha256', "$header.$payload_enc", $secret, true)
        );

        return "$header.$payload_enc.$signature";
    }

    /**
     * Validate and decode JWT token
     */
    public function validate_token($token) {
        $secret = wp_hash('sap_panda_jwt_secret_' . wp_salt());
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;

        [$header, $payload, $signature] = $parts;
        $expected = $this->base64url_encode(
            hash_hmac('sha256', "$header.$payload", $secret, true)
        );

        if (!hash_equals($expected, $signature)) return false;

        $data = json_decode($this->base64url_decode($payload), true);
        if (!$data || !isset($data['exp']) || $data['exp'] < time()) return false;

        return $data['data']['user_id'] ?? false;
    }

    /**
     * Get user from token in request headers
     *
     * 対応する環境:
     * - Apache mod_php:     $_SERVER['HTTP_AUTHORIZATION']
     * - Apache CGI/FastCGI: REDIRECT_HTTP_AUTHORIZATION
     * - Nginx + PHP-FPM:    $_SERVER['HTTP_AUTHORIZATION'] (明示的に渡す設定が必要)
     * - WordPress.com / 共有ホスティング: apache_request_headers()
     */
    public function get_user_id_from_request() {
        $auth = '';

        // 1. HTTP_AUTHORIZATION（Apache + Nginx 共通）
        if ( ! empty( $_SERVER['HTTP_AUTHORIZATION'] ) ) {
            $auth = $_SERVER['HTTP_AUTHORIZATION'];
        }

        // 2. REDIRECT_HTTP_AUTHORIZATION（Apache CGI/FastCGI）
        if ( empty( $auth ) && ! empty( $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ) ) {
            $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }

        // 3. Authorization（一部の環境）
        if ( empty( $auth ) && ! empty( $_SERVER['Authorization'] ) ) {
            $auth = $_SERVER['Authorization'];
        }

        // 4. Apache の apache_request_headers()
        if ( empty( $auth ) && function_exists( 'apache_request_headers' ) ) {
            $headers = apache_request_headers();
            $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        }

        // 5. GET/POST/_token パラメータ（Nginx が Authorization を通さない環境用）
        if ( empty( $auth ) && ! empty( $_REQUEST['_token'] ) ) {
            $auth = 'Bearer ' . $_REQUEST['_token'];
        }

        // 6. Cookie（最も確実。Nginx 設定に依存しない）
        if ( empty( $auth ) && ! empty( $_COOKIE['sap_panda_token'] ) ) {
            $auth = 'Bearer ' . $_COOKIE['sap_panda_token'];
        }

        if ( preg_match( '/Bearer\s(\S+)/', $auth, $matches ) ) {
            return $this->validate_token( $matches[1] );
        }

        return false;
    }

    /**
     * Login endpoint
     */
    public function login($request) {
        $email    = sanitize_email($request->get_param('email'));
        $password = $request->get_param('password');

        if (empty($email) || empty($password)) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'メールアドレスとパスワードを入力してください。',
                'code'    => 'missing_fields',
            ], 400);
        }

        $user = wp_authenticate($email, $password);
        if (is_wp_error($user)) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'メールアドレスまたはパスワードが正しくありません。',
                'code'    => 'auth_failed',
            ], 401);
        }

        $token = $this->generate_token($user->ID);

        // Cookie にも保存（Nginx が Authorization ヘッダーを通さない環境用）
        setcookie( 'sap_panda_token', $token, time() + DAY_IN_SECONDS * 7, '/', '', false, true );

        return new WP_REST_Response([
            'success' => true,
            'data'    => [
                'token' => $token,
                'user'  => $this->format_user($user),
            ],
        ]);
    }

    /**
     * Register endpoint
     */
    public function register($request) {
        $email    = sanitize_email($request->get_param('email'));
        $password = $request->get_param('password');
        $name     = sanitize_text_field($request->get_param('display_name'));

        if (empty($email) || empty($password) || empty($name)) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'メールアドレス、パスワード、お名前を入力してください。',
                'code'    => 'missing_fields',
            ], 400);
        }

        // Password strength validation
        if (strlen($password) < 6) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'パスワードは6文字以上で入力してください。',
                'code'    => 'weak_password',
            ], 400);
        }

        if (email_exists($email)) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'このメールアドレスは既に登録されています。',
                'code'    => 'email_exists',
            ], 409);
        }

        $user_id = wp_create_user($email, $password, $email);
        if (is_wp_error($user_id)) {
            return new WP_REST_Response([
                'success' => false,
                'message' => '登録に失敗しました。',
                'code'    => 'registration_failed',
            ], 500);
        }

        if (!empty($name)) {
            wp_update_user(['ID' => $user_id, 'display_name' => $name]);
        }

        // Send verification email
        $blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
        $subject  = sprintf('[%s] メールアドレスの確認', $blogname);
        $message  = sprintf(
            "%s 様\n\nパンダ先生へのご登録ありがとうございます！🎋\n\n" .
            "メールアドレス: %s\nお名前: %s\n\n" .
            "以下のリンクをクリックして、アカウントを有効化してください:\n%s\n\n" .
            "このメールに心当たりがない場合は、お手数ですが破棄してください。\n\n--\n%s",
            $name, $email, $name,
            wp_lostpassword_url(),
            $blogname
        );
        wp_mail($email, $subject, $message);

        return new WP_REST_Response([
            'success' => true,
            'data'    => ['user_id' => $user_id, 'message' => '登録が完了しました。確認メールをお送りしました。'],
        ], 201);
    }

    /**
     * Validate token endpoint
     */
    public function validate($request) {
        $user_id = $this->get_user_id_from_request();
        return new WP_REST_Response([
            'success' => true,
            'data'    => ['valid' => (bool) $user_id, 'user_id' => $user_id],
        ]);
    }

    private function format_user($user) {
        return [
            'id'           => $user->ID,
            'email'        => $user->user_email,
            'display_name' => $user->display_name,
            'avatar_url'   => get_avatar_url($user->ID),
            'roles'        => array_values($user->roles),
        ];
    }

    private function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64url_decode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
}
