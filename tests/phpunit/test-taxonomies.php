<?php
/**
 * Test class for SAP Panda Taxonomy Registration
 *
 * @package SAP_Panda_API
 */

class Test_Taxonomy_Registration extends WP_UnitTestCase {

    private $tax;

    public function setUp(): void {
        parent::setUp();
        $tax = new SAP_Panda_Taxonomies();
        $tax->register();
    }

    public function test_sap_module_taxonomy_exists() {
        $this->assertTrue(taxonomy_exists('sap_module'));
    }

    public function test_difficulty_taxonomy_exists() {
        $this->assertTrue(taxonomy_exists('difficulty'));
    }

    public function test_topic_taxonomy_exists() {
        $this->assertTrue(taxonomy_exists('topic'));
    }

    public function test_sap_module_terms_are_seeded() {
        $terms = get_terms(['taxonomy' => 'sap_module', 'hide_empty' => false, 'fields' => 'slugs']);
        $this->assertContains('fi', $terms);
        $this->assertContains('co', $terms);
        $this->assertContains('mm', $terms);
        $this->assertContains('abap', $terms);
    }

    public function test_difficulty_terms_exist() {
        $terms = get_terms(['taxonomy' => 'difficulty', 'hide_empty' => false, 'fields' => 'slugs']);
        $this->assertContains('beginner', $terms);
        $this->assertContains('advanced', $terms);
    }
}
