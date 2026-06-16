<?php
/**
 * Test class for SAP Panda Auth
 *
 * @package SAP_Panda_API
 */

class Test_Auth extends WP_UnitTestCase {

    /**
     * @var SAP_Panda_Auth
     */
    private $auth;

    public function setUp(): void {
        parent::setUp();
        $this->auth = new SAP_Panda_Auth();
    }

    public function test_login_with_valid_credentials() {
        $user_id = $this->factory->user->create([
            'user_login' => 'testuser',
            'user_email' => 'test@panda.com',
            'user_pass'  => 'password123',
        ]);

        $request = new WP_REST_Request('POST');
        $request->set_param('email', 'test@panda.com');
        $request->set_param('password', 'password123');

        $response = $this->auth->login($request);
        $data = $response->get_data();

        $this->assertTrue($data['success']);
        $this->assertArrayHasKey('token', $data['data']);
        $this->assertEquals('testuser', $data['data']['user']['display_name']);
    }

    public function test_login_with_invalid_credentials() {
        $request = new WP_REST_Request('POST');
        $request->set_param('email', 'wrong@email.com');
        $request->set_param('password', 'wrongpass');

        $response = $this->auth->login($request);
        $this->assertEquals(401, $response->get_status());
    }

    public function test_login_with_missing_fields() {
        $request = new WP_REST_Request('POST');
        $request->set_param('email', '');

        $response = $this->auth->login($request);
        $this->assertEquals(400, $response->get_status());
    }

    public function test_register_new_user() {
        $request = new WP_REST_Request('POST');
        $request->set_param('email', 'newuser@panda.com');
        $request->set_param('password', 'secure123');
        $request->set_param('display_name', '新規ユーザー');

        $response = $this->auth->register($request);
        $data = $response->get_data();

        $this->assertTrue($data['success']);
        $this->assertArrayHasKey('user_id', $data['data']);
    }

    public function test_register_with_duplicate_email() {
        $this->factory->user->create([
            'user_email' => 'exists@panda.com',
            'user_login' => 'exists',
        ]);

        $request = new WP_REST_Request('POST');
        $request->set_param('email', 'exists@panda.com');
        $request->set_param('password', 'password123');

        $response = $this->auth->register($request);
        $this->assertEquals(409, $response->get_status());
    }

    public function test_token_validation() {
        $user_id = $this->factory->user->create([
            'user_login' => 'validuser',
            'user_email' => 'valid@panda.com',
        ]);

        // Generate token via login
        $login_request = new WP_REST_Request('POST');
        $login_request->set_param('email', 'valid@panda.com');
        $login_request->set_param('password', 'password123');

        $login_response = $this->auth->login($login_request);
        $login_data = $login_response->get_data();
        $token = $login_data['data']['token'];

        // Validate the token
        $_SERVER['HTTP_AUTHORIZATION'] = "Bearer $token";
        $valid = $this->auth->get_user_id_from_request();
        $this->assertEquals($user_id, $valid);
    }
}
