from os import environ

import django
from django.test import LiveServerTestCase
from selenium import webdriver

from server.mongodb.driver import MongoDriver


BROWSERSTACK_USERNAME = environ.get('BROWSERSTACK_USERNAME')
BROWSERSTACK_KEY = environ.get('BROWSERSTACK_KEY')
REPOSITORY_PATH = environ.get('TRAVIS_REPO_SLUG')

from func_test.custom_driver import CustomWebDriver


def init_browser():
    if BROWSERSTACK_KEY:
        test_url = "http://{0}:{1}@hub.browserstack.com:80/wd/hub".format(BROWSERSTACK_USERNAME,
                                                                          BROWSERSTACK_KEY)
        # Specify capabilities
        desired_cap = {'browser': 'Firefox',
                       'browser_version': '40.0',
                       'os': 'OS X',
                       'os_version': 'Yosemite',
                       'resolution': '1024x768',
                       'browserstack.local': True,
                       'browserstack.debug': True
                       }
        driver = webdriver.Remote(command_executor=test_url, desired_capabilities=desired_cap)
    else:
        # PhantomJS (Silent mode)
        # self.driver = webdriver.PhantomJS()

        # Firefox (Graphic mode)
        #driver = webdriver.Firefox()
        driver = CustomWebDriver()
    return driver


class BrowserStackTest(LiveServerTestCase):
    def __init__(self, *args, **kwargs):
        super(BrowserStackTest, self).__init__(*args, **kwargs)
        django.setup()

    def setUp(self):
        self.db = MongoDriver.instance()
        self.base_url = self.live_server_url
        self.driver = init_browser()

    def tearDown(self):
        self.driver.quit()
