<?php
/**
 * Test class for SAP Panda REST API
 *
 * @package SAP_Panda_API
 */

class Test_REST_API extends WP_UnitTestCase {

    /**
     * @var SAP_Panda_REST
     */
    private $rest;

    public function setUp(): void {
        parent::setUp();
        $this->rest = new SAP_Panda_REST();
        $this->rest->register_routes();

        // Seed taxonomies
        $tax = new SAP_Panda_Taxonomies();
        $tax->register();
    }

    public function test_articles_route_is_registered() {
        $routes = rest_get_server()->get_routes();
        $this->assertArrayHasKey('/sap/v1/articles', $routes);
    }

    public function test_modules_route_is_registered() {
        $routes = rest_get_server()->get_routes();
        $this->assertArrayHasKey('/sap/v1/modules', $routes);
    }

    public function test_cases_route_is_registered() {
        $routes = rest_get_server()->get_routes();
        $this->assertArrayHasKey('/sap/v1/cases', $routes);
    }

    public function test_auth_routes_are_registered() {
        $routes = rest_get_server()->get_routes();
        $this->assertArrayHasKey('/sap/v1/auth/login', $routes);
        $this->assertArrayHasKey('/sap/v1/auth/register', $routes);
    }

    public function test_get_articles_returns_articles() {
        // Create test articles
        $post_id = $this->factory->post->create([
            'post_title'   => 'テスト記事',
            'post_content' => 'テスト内容',
            'post_status'  => 'publish',
        ]);

        $request = new WP_REST_Request('GET', '/sap/v1/articles');
        $response = $this->rest->get_articles($request);
        $data = $response->get_data();

        $this->assertTrue($data['success']);
        $this->assertGreaterThanOrEqual(1, count($data['data']));
    }

    public function test_get_modules_returns_list() {
        $response = $this->rest->get_modules();
        $data = $response->get_data();
        $this->assertTrue($data['success']);
        $this->assertIsArray($data['data']);
    }

    public function test_get_article_returns_404_for_nonexistent() {
        $request = new WP_REST_Request('GET');
        $request->set_url_params(['id' => 99999]);

        $response = $this->rest->get_article($request);
        $this->assertEquals(404, $response->get_status());
    }

    public function test_search_articles_by_keyword() {
        $this->factory->post->create([
            'post_title'   => 'ABAP パフォーマンス入門',
            'post_content' => 'ABAPの高速化について解説します。',
            'post_status'  => 'publish',
        ]);

        $request = new WP_REST_Request('GET');
        $request->set_param('q', 'ABAP');
        $response = $this->rest->search_articles($request);
        $data = $response->get_data();

        $this->assertTrue($data['success']);
        $this->assertGreaterThanOrEqual(1, count($data['data']));
    }
}
