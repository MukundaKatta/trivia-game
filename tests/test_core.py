"""Tests for TriviaGame."""
from src.core import TriviaGame
def test_init(): assert TriviaGame().get_stats()["ops"] == 0
def test_op(): c = TriviaGame(); c.process(x=1); assert c.get_stats()["ops"] == 1
def test_multi(): c = TriviaGame(); [c.process() for _ in range(5)]; assert c.get_stats()["ops"] == 5
def test_reset(): c = TriviaGame(); c.process(); c.reset(); assert c.get_stats()["ops"] == 0
def test_service_name(): c = TriviaGame(); r = c.process(); assert r["service"] == "trivia-game"
