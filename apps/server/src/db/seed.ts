import { v4 as uuid } from 'uuid';
import { getDb } from './schema.js';
import type { Category, Difficulty } from '@trivia/shared';

interface SeedQuestion {
  category: Category;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
}

const questions: SeedQuestion[] = [
  // ==================== SCIENCE (26 questions) ====================
  { category: 'Science', difficulty: 'easy', question: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1 },
  { category: 'Science', difficulty: 'easy', question: 'What is the chemical symbol for water?', options: ['H2O', 'CO2', 'NaCl', 'O2'], correctIndex: 0 },
  { category: 'Science', difficulty: 'easy', question: 'How many bones are in the adult human body?', options: ['186', '206', '226', '246'], correctIndex: 1 },
  { category: 'Science', difficulty: 'easy', question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctIndex: 2 },
  { category: 'Science', difficulty: 'easy', question: 'What is the largest organ in the human body?', options: ['Heart', 'Liver', 'Brain', 'Skin'], correctIndex: 3 },
  { category: 'Science', difficulty: 'easy', question: 'What is the speed of light approximately?', options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'], correctIndex: 0 },
  { category: 'Science', difficulty: 'easy', question: 'Which element has the atomic number 1?', options: ['Helium', 'Hydrogen', 'Lithium', 'Carbon'], correctIndex: 1 },
  { category: 'Science', difficulty: 'medium', question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Apparatus'], correctIndex: 2 },
  { category: 'Science', difficulty: 'medium', question: 'What type of bond involves the sharing of electrons?', options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], correctIndex: 1 },
  { category: 'Science', difficulty: 'medium', question: 'What is the most abundant gas in Earth\'s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], correctIndex: 2 },
  { category: 'Science', difficulty: 'medium', question: 'What force keeps planets in orbit around the sun?', options: ['Electromagnetic', 'Nuclear', 'Gravity', 'Friction'], correctIndex: 2 },
  { category: 'Science', difficulty: 'medium', question: 'What is the pH of pure water?', options: ['5', '7', '9', '10'], correctIndex: 1 },
  { category: 'Science', difficulty: 'medium', question: 'Which planet has the most moons?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correctIndex: 1 },
  { category: 'Science', difficulty: 'medium', question: 'What is the half-life of Carbon-14?', options: ['1,730 years', '5,730 years', '10,730 years', '15,730 years'], correctIndex: 1 },
  { category: 'Science', difficulty: 'medium', question: 'Which subatomic particle has no electric charge?', options: ['Proton', 'Electron', 'Neutron', 'Positron'], correctIndex: 2 },
  { category: 'Science', difficulty: 'hard', question: 'What is the Schwarzschild radius?', options: ['Radius of a neutron star', 'Event horizon of a black hole', 'Radius of the observable universe', 'Bohr radius of hydrogen'], correctIndex: 1 },
  { category: 'Science', difficulty: 'hard', question: 'Which enzyme unwinds DNA during replication?', options: ['DNA polymerase', 'Ligase', 'Helicase', 'Primase'], correctIndex: 2 },
  { category: 'Science', difficulty: 'hard', question: 'What is the Chandrasekhar limit?', options: ['1.4 solar masses', '2.4 solar masses', '3.4 solar masses', '0.4 solar masses'], correctIndex: 0 },
  { category: 'Science', difficulty: 'hard', question: 'What particle was discovered at CERN in 2012?', options: ['Graviton', 'Tachyon', 'Higgs Boson', 'Dark Photon'], correctIndex: 2 },
  { category: 'Science', difficulty: 'hard', question: 'What is the rarest blood type?', options: ['O negative', 'AB negative', 'B negative', 'A negative'], correctIndex: 1 },
  { category: 'Science', difficulty: 'medium', question: 'What vitamin does the body produce when exposed to sunlight?', options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin E'], correctIndex: 2 },
  { category: 'Science', difficulty: 'easy', question: 'What is the chemical formula for table salt?', options: ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], correctIndex: 0 },
  { category: 'Science', difficulty: 'medium', question: 'How many chromosomes do humans have?', options: ['23', '44', '46', '48'], correctIndex: 2 },
  { category: 'Science', difficulty: 'hard', question: 'What is the Heisenberg Uncertainty Principle about?', options: ['Speed of light limit', 'Position and momentum of particles', 'Energy conservation', 'Wave-particle duality'], correctIndex: 1 },
  { category: 'Science', difficulty: 'easy', question: 'What is the closest star to Earth?', options: ['Proxima Centauri', 'Alpha Centauri', 'The Sun', 'Sirius'], correctIndex: 2 },
  { category: 'Science', difficulty: 'medium', question: 'What is absolute zero in Celsius?', options: ['-273.15°C', '-459.67°C', '-100°C', '-0°C'], correctIndex: 0 },

  // ==================== HISTORY (26 questions) ====================
  { category: 'History', difficulty: 'easy', question: 'In what year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctIndex: 2 },
  { category: 'History', difficulty: 'easy', question: 'Who was the first President of the United States?', options: ['John Adams', 'Thomas Jefferson', 'Benjamin Franklin', 'George Washington'], correctIndex: 3 },
  { category: 'History', difficulty: 'easy', question: 'What ancient wonder was located in Egypt?', options: ['Colosseum', 'Great Pyramid of Giza', 'Hanging Gardens', 'Lighthouse of Alexandria'], correctIndex: 1 },
  { category: 'History', difficulty: 'easy', question: 'Which empire built the Colosseum?', options: ['Greek', 'Persian', 'Roman', 'Ottoman'], correctIndex: 2 },
  { category: 'History', difficulty: 'easy', question: 'In what year did the Titanic sink?', options: ['1910', '1912', '1914', '1916'], correctIndex: 1 },
  { category: 'History', difficulty: 'easy', question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'], correctIndex: 2 },
  { category: 'History', difficulty: 'medium', question: 'What year did the Berlin Wall fall?', options: ['1987', '1988', '1989', '1990'], correctIndex: 2 },
  { category: 'History', difficulty: 'medium', question: 'Who was the first woman to fly solo across the Atlantic?', options: ['Amelia Earhart', 'Bessie Coleman', 'Harriet Quimby', 'Jacqueline Cochran'], correctIndex: 0 },
  { category: 'History', difficulty: 'medium', question: 'The French Revolution began in which year?', options: ['1776', '1789', '1799', '1804'], correctIndex: 1 },
  { category: 'History', difficulty: 'medium', question: 'Who discovered penicillin?', options: ['Louis Pasteur', 'Alexander Fleming', 'Joseph Lister', 'Robert Koch'], correctIndex: 1 },
  { category: 'History', difficulty: 'medium', question: 'What was the longest war in history?', options: ['Hundred Years War', 'Reconquista', 'Thirty Years War', 'Punic Wars'], correctIndex: 1 },
  { category: 'History', difficulty: 'medium', question: 'Which country was the first to grant women the right to vote?', options: ['United States', 'United Kingdom', 'New Zealand', 'Finland'], correctIndex: 2 },
  { category: 'History', difficulty: 'hard', question: 'What was the capital of the Byzantine Empire?', options: ['Rome', 'Athens', 'Constantinople', 'Alexandria'], correctIndex: 2 },
  { category: 'History', difficulty: 'hard', question: 'The Treaty of Westphalia ended which war?', options: ['Hundred Years War', 'Thirty Years War', 'Seven Years War', 'Napoleonic Wars'], correctIndex: 1 },
  { category: 'History', difficulty: 'hard', question: 'Who was the last pharaoh of Ancient Egypt?', options: ['Nefertiti', 'Hatshepsut', 'Cleopatra VII', 'Ramesses II'], correctIndex: 2 },
  { category: 'History', difficulty: 'hard', question: 'What year was the Magna Carta signed?', options: ['1066', '1215', '1348', '1415'], correctIndex: 1 },
  { category: 'History', difficulty: 'medium', question: 'Which civilization built Machu Picchu?', options: ['Aztec', 'Maya', 'Inca', 'Olmec'], correctIndex: 2 },
  { category: 'History', difficulty: 'easy', question: 'Who was the first man to walk on the Moon?', options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn'], correctIndex: 1 },
  { category: 'History', difficulty: 'medium', question: 'What event started World War I?', options: ['Invasion of Poland', 'Assassination of Archduke Franz Ferdinand', 'Sinking of Lusitania', 'Treaty of Versailles'], correctIndex: 1 },
  { category: 'History', difficulty: 'hard', question: 'The Rosetta Stone helped decipher which writing system?', options: ['Cuneiform', 'Egyptian Hieroglyphs', 'Linear B', 'Sanskrit'], correctIndex: 1 },
  { category: 'History', difficulty: 'easy', question: 'Which country gifted the Statue of Liberty to the USA?', options: ['England', 'Spain', 'France', 'Germany'], correctIndex: 2 },
  { category: 'History', difficulty: 'medium', question: 'What was the name of the ship the Pilgrims sailed to America?', options: ['Santa Maria', 'Mayflower', 'Endeavour', 'Victoria'], correctIndex: 1 },
  { category: 'History', difficulty: 'hard', question: 'Who unified the kingdoms of Upper and Lower Egypt?', options: ['Narmer', 'Khufu', 'Tutankhamun', 'Akhenaten'], correctIndex: 0 },
  { category: 'History', difficulty: 'medium', question: 'In what year did the Soviet Union dissolve?', options: ['1989', '1990', '1991', '1992'], correctIndex: 2 },
  { category: 'History', difficulty: 'hard', question: 'What battle is considered the turning point of the Pacific Theater in WWII?', options: ['Iwo Jima', 'Midway', 'Guadalcanal', 'Pearl Harbor'], correctIndex: 1 },
  { category: 'History', difficulty: 'easy', question: 'What wall divided Berlin from 1961 to 1989?', options: ['Iron Curtain', 'Berlin Wall', 'Hadrian\'s Wall', 'Great Wall'], correctIndex: 1 },

  // ==================== GEOGRAPHY (26 questions) ====================
  { category: 'Geography', difficulty: 'easy', question: 'What is the largest continent by area?', options: ['Africa', 'North America', 'Asia', 'Europe'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'easy', question: 'What is the capital of France?', options: ['London', 'Berlin', 'Madrid', 'Paris'], correctIndex: 3 },
  { category: 'Geography', difficulty: 'easy', question: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correctIndex: 1 },
  { category: 'Geography', difficulty: 'easy', question: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3 },
  { category: 'Geography', difficulty: 'easy', question: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correctIndex: 1 },
  { category: 'Geography', difficulty: 'easy', question: 'On which continent is the Sahara Desert?', options: ['Asia', 'South America', 'Africa', 'Australia'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'easy', question: 'What is the capital of Japan?', options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'medium', question: 'What is the deepest ocean trench?', options: ['Tonga Trench', 'Philippine Trench', 'Mariana Trench', 'Java Trench'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'medium', question: 'Which country has the most natural lakes?', options: ['United States', 'Russia', 'Canada', 'Finland'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'medium', question: 'What is the tallest mountain in the world?', options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'medium', question: 'Which river runs through the Grand Canyon?', options: ['Mississippi', 'Columbia', 'Rio Grande', 'Colorado'], correctIndex: 3 },
  { category: 'Geography', difficulty: 'medium', question: 'What country has the largest population?', options: ['India', 'United States', 'China', 'Indonesia'], correctIndex: 0 },
  { category: 'Geography', difficulty: 'medium', question: 'What is the driest continent?', options: ['Africa', 'Australia', 'Antarctica', 'Asia'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'hard', question: 'What is the capital of Bhutan?', options: ['Thimphu', 'Kathmandu', 'Colombo', 'Dhaka'], correctIndex: 0 },
  { category: 'Geography', difficulty: 'hard', question: 'Which strait separates Europe from Africa?', options: ['Bosphorus', 'Gibraltar', 'Hormuz', 'Malacca'], correctIndex: 1 },
  { category: 'Geography', difficulty: 'hard', question: 'What is the largest island in the world?', options: ['Borneo', 'Madagascar', 'Greenland', 'New Guinea'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'hard', question: 'Which country has the most time zones?', options: ['Russia', 'United States', 'France', 'China'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'medium', question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'easy', question: 'Which country is shaped like a boot?', options: ['Spain', 'Greece', 'Italy', 'Portugal'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'medium', question: 'The Great Barrier Reef is off the coast of which country?', options: ['Indonesia', 'Philippines', 'Australia', 'Papua New Guinea'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'hard', question: 'What is the only country that borders both the Atlantic and Indian Oceans?', options: ['South Africa', 'Mozambique', 'Madagascar', 'Tanzania'], correctIndex: 0 },
  { category: 'Geography', difficulty: 'medium', question: 'What is the largest desert in the world?', options: ['Sahara', 'Arabian', 'Antarctic', 'Gobi'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'easy', question: 'What are the two longest rivers in the United States?', options: ['Missouri & Mississippi', 'Colorado & Ohio', 'Columbia & Hudson', 'Rio Grande & Arkansas'], correctIndex: 0 },
  { category: 'Geography', difficulty: 'hard', question: 'What is the capital of Mongolia?', options: ['Astana', 'Ulaanbaatar', 'Bishkek', 'Tashkent'], correctIndex: 1 },
  { category: 'Geography', difficulty: 'medium', question: 'Which African country was formerly known as Abyssinia?', options: ['Somalia', 'Eritrea', 'Ethiopia', 'Sudan'], correctIndex: 2 },
  { category: 'Geography', difficulty: 'hard', question: 'What is the longest mountain range in the world?', options: ['Himalayas', 'Rocky Mountains', 'Andes', 'Alps'], correctIndex: 2 },

  // ==================== ENTERTAINMENT (26 questions) ====================
  { category: 'Entertainment', difficulty: 'easy', question: 'Who directed Jurassic Park?', options: ['James Cameron', 'Steven Spielberg', 'George Lucas', 'Ridley Scott'], correctIndex: 1 },
  { category: 'Entertainment', difficulty: 'easy', question: 'What is the highest-grossing film of all time?', options: ['Avengers: Endgame', 'Avatar', 'Titanic', 'Star Wars'], correctIndex: 1 },
  { category: 'Entertainment', difficulty: 'easy', question: 'Which band sang "Bohemian Rhapsody"?', options: ['The Beatles', 'Led Zeppelin', 'Queen', 'Pink Floyd'], correctIndex: 2 },
  { category: 'Entertainment', difficulty: 'easy', question: 'What is the name of Batman\'s butler?', options: ['Jarvis', 'Alfred', 'Watson', 'Reginald'], correctIndex: 1 },
  { category: 'Entertainment', difficulty: 'easy', question: 'In which year was the first Harry Potter movie released?', options: ['1999', '2000', '2001', '2002'], correctIndex: 2 },
  { category: 'Entertainment', difficulty: 'easy', question: 'What is the name of the fictional country in Black Panther?', options: ['Zamunda', 'Wakanda', 'Genovia', 'Latveria'], correctIndex: 1 },
  { category: 'Entertainment', difficulty: 'medium', question: 'What was the first Pixar movie?', options: ['A Bug\'s Life', 'Finding Nemo', 'Toy Story', 'Monsters, Inc.'], correctIndex: 2 },
  { category: 'Entertainment', difficulty: 'medium', question: 'Who played the Joker in The Dark Knight?', options: ['Jack Nicholson', 'Jared Leto', 'Joaquin Phoenix', 'Heath Ledger'], correctIndex: 3 },
  { category: 'Entertainment', difficulty: 'medium', question: 'What TV show features the character Walter White?', options: ['Dexter', 'Breaking Bad', 'Better Call Saul', 'The Wire'], correctIndex: 1 },
  { category: 'Entertainment', difficulty: 'medium', question: 'Which Disney movie features the song "Let It Go"?', options: ['Tangled', 'Moana', 'Frozen', 'Brave'], correctIndex: 2 },
  { category: 'Entertainment', difficulty: 'medium', question: 'Who created the Marvel Cinematic Universe?', options: ['Stan Lee', 'Kevin Feige', 'Jon Favreau', 'Joss Whedon'], correctIndex: 1 },
  { category: 'Entertainment', difficulty: 'medium', question: 'What is the longest-running animated TV show?', options: ['Family Guy', 'South Park', 'The Simpsons', 'SpongeBob'], correctIndex: 2 },
  { category: 'Entertainment', difficulty: 'hard', question: 'What film won the first Academy Award for Best Picture?', options: ['Wings', 'Sunrise', 'The Jazz Singer', 'All Quiet on the Western Front'], correctIndex: 0 },
  { category: 'Entertainment', difficulty: 'hard', question: 'Who composed the score for Inception?', options: ['John Williams', 'Hans Zimmer', 'Howard Shore', 'James Newton Howard'], correctIndex: 1 },
  { category: 'Entertainment', difficulty: 'hard', question: 'What is the real name of the rapper Eminem?', options: ['Marshall Mathers', 'Curtis Jackson', 'Andre Young', 'Shawn Carter'], correctIndex: 0 },
  { category: 'Entertainment', difficulty: 'medium', question: 'In Friends, what is the name of Ross\'s first wife?', options: ['Emily', 'Rachel', 'Carol', 'Julie'], correctIndex: 2 },
  { category: 'Entertainment', difficulty: 'hard', question: 'Which movie features the quote "Here\'s looking at you, kid"?', options: ['Gone with the Wind', 'Casablanca', 'The Maltese Falcon', 'Citizen Kane'], correctIndex: 1 },
  { category: 'Entertainment', difficulty: 'easy', question: 'What color is Pikachu?', options: ['Red', 'Blue', 'Yellow', 'Green'], correctIndex: 2 },
  { category: 'Entertainment', difficulty: 'medium', question: 'Which artist has the most Grammy Awards?', options: ['Beyonce', 'Stevie Wonder', 'Georg Solti', 'Quincy Jones'], correctIndex: 0 },
  { category: 'Entertainment', difficulty: 'hard', question: 'What was Stanley Kubrick\'s last film?', options: ['Full Metal Jacket', 'A Clockwork Orange', 'Eyes Wide Shut', 'The Shining'], correctIndex: 2 },
  { category: 'Entertainment', difficulty: 'easy', question: 'What is the name of the main character in The Legend of Zelda?', options: ['Zelda', 'Link', 'Ganondorf', 'Epona'], correctIndex: 1 },
  { category: 'Entertainment', difficulty: 'medium', question: 'Which show coined the phrase "Winter is Coming"?', options: ['Vikings', 'The Witcher', 'Game of Thrones', 'Lord of the Rings'], correctIndex: 2 },
  { category: 'Entertainment', difficulty: 'hard', question: 'What year was the original Pac-Man released?', options: ['1978', '1980', '1982', '1984'], correctIndex: 1 },
  { category: 'Entertainment', difficulty: 'medium', question: 'Who voices Woody in Toy Story?', options: ['Tim Allen', 'Tom Hanks', 'Billy Crystal', 'Robin Williams'], correctIndex: 1 },
  { category: 'Entertainment', difficulty: 'easy', question: 'What superhero is also known as the "Man of Steel"?', options: ['Batman', 'Iron Man', 'Superman', 'Thor'], correctIndex: 2 },
  { category: 'Entertainment', difficulty: 'hard', question: 'Which Studio Ghibli film won the Academy Award for Best Animated Feature?', options: ['My Neighbor Totoro', 'Spirited Away', 'Princess Mononoke', 'Howl\'s Moving Castle'], correctIndex: 1 },

  // ==================== SPORTS (26 questions) ====================
  { category: 'Sports', difficulty: 'easy', question: 'How many players are on a soccer team on the field?', options: ['9', '10', '11', '12'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'easy', question: 'In which sport is a "slam dunk" performed?', options: ['Volleyball', 'Tennis', 'Basketball', 'Football'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'easy', question: 'How many rings are on the Olympic flag?', options: ['3', '4', '5', '6'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'easy', question: 'What sport is played at Wimbledon?', options: ['Cricket', 'Golf', 'Tennis', 'Rugby'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'easy', question: 'Which country won the 2022 FIFA World Cup?', options: ['France', 'Brazil', 'Argentina', 'Germany'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'medium', question: 'What is the diameter of a basketball hoop in inches?', options: ['16', '18', '20', '22'], correctIndex: 1 },
  { category: 'Sports', difficulty: 'medium', question: 'Who holds the record for most Olympic gold medals?', options: ['Usain Bolt', 'Michael Phelps', 'Carl Lewis', 'Mark Spitz'], correctIndex: 1 },
  { category: 'Sports', difficulty: 'medium', question: 'In baseball, how many strikes make an out?', options: ['2', '3', '4', '5'], correctIndex: 1 },
  { category: 'Sports', difficulty: 'medium', question: 'What country invented the sport of cricket?', options: ['Australia', 'India', 'South Africa', 'England'], correctIndex: 3 },
  { category: 'Sports', difficulty: 'medium', question: 'Who has won the most Grand Slam titles in men\'s tennis?', options: ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Pete Sampras'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'medium', question: 'What is the only country to have played in every FIFA World Cup?', options: ['Germany', 'Argentina', 'Brazil', 'Italy'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'hard', question: 'What is the length of a marathon in miles?', options: ['24.2', '25.2', '26.2', '27.2'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'hard', question: 'In which year were the first modern Olympic Games held?', options: ['1892', '1896', '1900', '1904'], correctIndex: 1 },
  { category: 'Sports', difficulty: 'hard', question: 'What sport uses the term "albatross"?', options: ['Bowling', 'Golf', 'Cricket', 'Badminton'], correctIndex: 1 },
  { category: 'Sports', difficulty: 'easy', question: 'What color is the bull\'s-eye on a standard archery target?', options: ['Red', 'Yellow', 'White', 'Black'], correctIndex: 1 },
  { category: 'Sports', difficulty: 'medium', question: 'How long is an NBA basketball court in feet?', options: ['84', '90', '94', '100'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'hard', question: 'Who was the first player to score 100 points in an NBA game?', options: ['Michael Jordan', 'Wilt Chamberlain', 'Kareem Abdul-Jabbar', 'LeBron James'], correctIndex: 1 },
  { category: 'Sports', difficulty: 'medium', question: 'Which country hosted the 2016 Summer Olympics?', options: ['China', 'UK', 'Brazil', 'Japan'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'easy', question: 'What sport does Tiger Woods play?', options: ['Tennis', 'Golf', 'Cricket', 'Polo'], correctIndex: 1 },
  { category: 'Sports', difficulty: 'hard', question: 'What is the only Grand Slam tournament played on clay?', options: ['Wimbledon', 'US Open', 'French Open', 'Australian Open'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'medium', question: 'How many periods are in an ice hockey game?', options: ['2', '3', '4', '5'], correctIndex: 1 },
  { category: 'Sports', difficulty: 'easy', question: 'In American football, how many points is a touchdown worth?', options: ['3', '5', '6', '7'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'hard', question: 'Which boxer was known as "The Greatest"?', options: ['Mike Tyson', 'Muhammad Ali', 'Joe Louis', 'Floyd Mayweather'], correctIndex: 1 },
  { category: 'Sports', difficulty: 'medium', question: 'What is the national sport of Canada?', options: ['Hockey', 'Lacrosse', 'Curling', 'Baseball'], correctIndex: 1 },
  { category: 'Sports', difficulty: 'hard', question: 'In which sport would you perform a "Fosbury Flop"?', options: ['Gymnastics', 'Diving', 'High Jump', 'Pole Vault'], correctIndex: 2 },
  { category: 'Sports', difficulty: 'easy', question: 'What sport is known as "the beautiful game"?', options: ['Basketball', 'Soccer/Football', 'Tennis', 'Baseball'], correctIndex: 1 },

  // ==================== TECHNOLOGY (26 questions) ====================
  { category: 'Technology', difficulty: 'easy', question: 'What does "HTML" stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Markup Language'], correctIndex: 0 },
  { category: 'Technology', difficulty: 'easy', question: 'Who founded Apple?', options: ['Bill Gates', 'Steve Jobs', 'Mark Zuckerberg', 'Jeff Bezos'], correctIndex: 1 },
  { category: 'Technology', difficulty: 'easy', question: 'What does "CPU" stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], correctIndex: 0 },
  { category: 'Technology', difficulty: 'easy', question: 'What year was the iPhone first released?', options: ['2005', '2006', '2007', '2008'], correctIndex: 2 },
  { category: 'Technology', difficulty: 'easy', question: 'What programming language is known for its use in web browsers?', options: ['Python', 'Java', 'JavaScript', 'C++'], correctIndex: 2 },
  { category: 'Technology', difficulty: 'medium', question: 'What does "API" stand for?', options: ['Application Programming Interface', 'Applied Program Integration', 'Automated Protocol Interface', 'Application Process Integration'], correctIndex: 0 },
  { category: 'Technology', difficulty: 'medium', question: 'Who is known as the father of computer science?', options: ['John von Neumann', 'Alan Turing', 'Charles Babbage', 'Ada Lovelace'], correctIndex: 1 },
  { category: 'Technology', difficulty: 'medium', question: 'What does "RAM" stand for?', options: ['Random Access Memory', 'Read Access Memory', 'Rapid Access Module', 'Random Allocation Memory'], correctIndex: 0 },
  { category: 'Technology', difficulty: 'medium', question: 'What year was Google founded?', options: ['1996', '1997', '1998', '1999'], correctIndex: 2 },
  { category: 'Technology', difficulty: 'medium', question: 'What is the most popular programming language as of 2024?', options: ['Java', 'Python', 'JavaScript', 'C++'], correctIndex: 1 },
  { category: 'Technology', difficulty: 'medium', question: 'What does "SQL" stand for?', options: ['Structured Query Language', 'Standard Query Logic', 'System Query Language', 'Sequential Query Language'], correctIndex: 0 },
  { category: 'Technology', difficulty: 'hard', question: 'What was the first computer virus called?', options: ['ILOVEYOU', 'Creeper', 'Morris Worm', 'Brain'], correctIndex: 1 },
  { category: 'Technology', difficulty: 'hard', question: 'In what year was Bitcoin created?', options: ['2007', '2008', '2009', '2010'], correctIndex: 2 },
  { category: 'Technology', difficulty: 'hard', question: 'What does "HTTPS" use for encryption?', options: ['AES', 'RSA', 'TLS/SSL', 'SHA-256'], correctIndex: 2 },
  { category: 'Technology', difficulty: 'easy', question: 'What company developed Android?', options: ['Apple', 'Microsoft', 'Google', 'Samsung'], correctIndex: 2 },
  { category: 'Technology', difficulty: 'medium', question: 'What is the name of Linux\'s mascot?', options: ['Beastie', 'Tux', 'Gnu', 'Puffy'], correctIndex: 1 },
  { category: 'Technology', difficulty: 'hard', question: 'What was the first message sent over ARPANET?', options: ['Hello World', 'Login', 'Lo', 'Test'], correctIndex: 2 },
  { category: 'Technology', difficulty: 'medium', question: 'What does "IoT" stand for?', options: ['Internet of Technology', 'Internet of Things', 'Integration of Technology', 'Interface of Things'], correctIndex: 1 },
  { category: 'Technology', difficulty: 'hard', question: 'Who invented the World Wide Web?', options: ['Vint Cerf', 'Tim Berners-Lee', 'Robert Kahn', 'Marc Andreessen'], correctIndex: 1 },
  { category: 'Technology', difficulty: 'medium', question: 'What does "GPU" stand for?', options: ['General Processing Unit', 'Graphics Processing Unit', 'Global Processing Unit', 'Graphical Program Unit'], correctIndex: 1 },
  { category: 'Technology', difficulty: 'easy', question: 'What does "Wi-Fi" stand for?', options: ['Wireless Fidelity', 'Wireless Finder', 'Wide Frequency', 'It\'s a brand name, not an acronym'], correctIndex: 3 },
  { category: 'Technology', difficulty: 'hard', question: 'What programming language was created by Bjarne Stroustrup?', options: ['Java', 'Python', 'C++', 'Rust'], correctIndex: 2 },
  { category: 'Technology', difficulty: 'medium', question: 'What company created the React JavaScript library?', options: ['Google', 'Microsoft', 'Facebook/Meta', 'Amazon'], correctIndex: 2 },
  { category: 'Technology', difficulty: 'hard', question: 'What year was the first email sent?', options: ['1965', '1971', '1975', '1980'], correctIndex: 1 },
  { category: 'Technology', difficulty: 'easy', question: 'What is the shortcut for "Copy" on Windows?', options: ['Ctrl+V', 'Ctrl+X', 'Ctrl+C', 'Ctrl+Z'], correctIndex: 2 },
  { category: 'Technology', difficulty: 'medium', question: 'What is the name of the AI that beat the world champion at Go?', options: ['Deep Blue', 'Watson', 'AlphaGo', 'GPT'], correctIndex: 2 },

  // ==================== ART (25 questions) ====================
  { category: 'Art', difficulty: 'easy', question: 'What are the three primary colors?', options: ['Red, Blue, Yellow', 'Red, Green, Blue', 'Red, Orange, Yellow', 'Blue, Green, Purple'], correctIndex: 0 },
  { category: 'Art', difficulty: 'easy', question: 'Who painted the Sistine Chapel ceiling?', options: ['Leonardo da Vinci', 'Raphael', 'Michelangelo', 'Botticelli'], correctIndex: 2 },
  { category: 'Art', difficulty: 'easy', question: 'What museum houses the Mona Lisa?', options: ['British Museum', 'Uffizi Gallery', 'Louvre', 'Met Museum'], correctIndex: 2 },
  { category: 'Art', difficulty: 'easy', question: 'Which artist is famous for cutting off his own ear?', options: ['Monet', 'Picasso', 'Van Gogh', 'Rembrandt'], correctIndex: 2 },
  { category: 'Art', difficulty: 'easy', question: 'What art movement is Salvador Dali associated with?', options: ['Impressionism', 'Cubism', 'Surrealism', 'Pop Art'], correctIndex: 2 },
  { category: 'Art', difficulty: 'medium', question: 'Who sculpted "The Thinker"?', options: ['Donatello', 'Rodin', 'Bernini', 'Michelangelo'], correctIndex: 1 },
  { category: 'Art', difficulty: 'medium', question: 'What art movement did Andy Warhol pioneer?', options: ['Abstract Expressionism', 'Minimalism', 'Pop Art', 'Dadaism'], correctIndex: 2 },
  { category: 'Art', difficulty: 'medium', question: 'Which artist painted "The Starry Night"?', options: ['Claude Monet', 'Vincent van Gogh', 'Paul Cezanne', 'Edgar Degas'], correctIndex: 1 },
  { category: 'Art', difficulty: 'medium', question: 'What technique uses small dots to create an image?', options: ['Impasto', 'Chiaroscuro', 'Pointillism', 'Sfumato'], correctIndex: 2 },
  { category: 'Art', difficulty: 'medium', question: 'Who painted "Girl with a Pearl Earring"?', options: ['Rembrandt', 'Vermeer', 'Rubens', 'Hals'], correctIndex: 1 },
  { category: 'Art', difficulty: 'medium', question: 'What art period came after the Medieval period?', options: ['Baroque', 'Renaissance', 'Romantic', 'Gothic'], correctIndex: 1 },
  { category: 'Art', difficulty: 'hard', question: 'What is "chiaroscuro" in art?', options: ['Use of gold leaf', 'Contrast of light and dark', 'Painting on wet plaster', 'Perspective drawing'], correctIndex: 1 },
  { category: 'Art', difficulty: 'hard', question: 'Who painted "Guernica"?', options: ['Salvador Dali', 'Pablo Picasso', 'Joan Miro', 'Francisco Goya'], correctIndex: 1 },
  { category: 'Art', difficulty: 'hard', question: 'What Japanese art form involves folding paper?', options: ['Ikebana', 'Origami', 'Bonsai', 'Ukiyo-e'], correctIndex: 1 },
  { category: 'Art', difficulty: 'easy', question: 'What shape has three sides?', options: ['Square', 'Pentagon', 'Triangle', 'Hexagon'], correctIndex: 2 },
  { category: 'Art', difficulty: 'medium', question: 'Who is known for his blue period paintings?', options: ['Monet', 'Matisse', 'Picasso', 'Renoir'], correctIndex: 2 },
  { category: 'Art', difficulty: 'hard', question: 'What material is "The Gates of Paradise" made of?', options: ['Marble', 'Bronze', 'Gilded bronze', 'Iron'], correctIndex: 2 },
  { category: 'Art', difficulty: 'medium', question: 'Which art movement emphasized geometric shapes and multiple perspectives?', options: ['Impressionism', 'Cubism', 'Fauvism', 'Art Nouveau'], correctIndex: 1 },
  { category: 'Art', difficulty: 'hard', question: 'Who painted "The Birth of Venus"?', options: ['Leonardo da Vinci', 'Raphael', 'Botticelli', 'Titian'], correctIndex: 2 },
  { category: 'Art', difficulty: 'medium', question: 'What is a fresco?', options: ['A type of sculpture', 'Painting on wet plaster', 'A glass technique', 'Painting on canvas'], correctIndex: 1 },
  { category: 'Art', difficulty: 'easy', question: 'What color do you get when you mix red and blue?', options: ['Green', 'Orange', 'Purple', 'Brown'], correctIndex: 2 },
  { category: 'Art', difficulty: 'hard', question: 'Who created the readymade "Fountain"?', options: ['Man Ray', 'Marcel Duchamp', 'Max Ernst', 'Francis Picabia'], correctIndex: 1 },
  { category: 'Art', difficulty: 'medium', question: 'What art form is Ansel Adams known for?', options: ['Painting', 'Sculpture', 'Photography', 'Architecture'], correctIndex: 2 },
  { category: 'Art', difficulty: 'hard', question: 'Which Renaissance artist wrote backwards in his notebooks?', options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'], correctIndex: 2 },
  { category: 'Art', difficulty: 'easy', question: 'What tool does a sculptor primarily use?', options: ['Brush', 'Chisel', 'Pen', 'Loom'], correctIndex: 1 },

  // ==================== LITERATURE (25 questions) ====================
  { category: 'Literature', difficulty: 'easy', question: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'easy', question: 'What is the first book of the Bible?', options: ['Exodus', 'Leviticus', 'Genesis', 'Deuteronomy'], correctIndex: 2 },
  { category: 'Literature', difficulty: 'easy', question: 'Who wrote "Harry Potter"?', options: ['Stephenie Meyer', 'Suzanne Collins', 'J.K. Rowling', 'Rick Riordan'], correctIndex: 2 },
  { category: 'Literature', difficulty: 'easy', question: 'What is the name of Sherlock Holmes\' companion?', options: ['Dr. Watson', 'Dr. Wilson', 'Dr. Walton', 'Dr. Williams'], correctIndex: 0 },
  { category: 'Literature', difficulty: 'easy', question: 'Who wrote "The Cat in the Hat"?', options: ['Roald Dahl', 'Dr. Seuss', 'Shel Silverstein', 'Eric Carle'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'medium', question: 'Who wrote "1984"?', options: ['Aldous Huxley', 'Ray Bradbury', 'George Orwell', 'H.G. Wells'], correctIndex: 2 },
  { category: 'Literature', difficulty: 'medium', question: 'What novel begins with "Call me Ishmael"?', options: ['The Old Man and the Sea', 'Moby-Dick', 'Treasure Island', 'Robinson Crusoe'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'medium', question: 'Who wrote "Pride and Prejudice"?', options: ['Charlotte Bronte', 'Jane Austen', 'Emily Bronte', 'Mary Shelley'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'medium', question: 'What is the longest novel ever written?', options: ['War and Peace', 'In Search of Lost Time', 'Les Miserables', 'Don Quixote'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'medium', question: 'Who wrote "The Great Gatsby"?', options: ['Ernest Hemingway', 'F. Scott Fitzgerald', 'John Steinbeck', 'William Faulkner'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'medium', question: 'In what language was "Don Quixote" originally written?', options: ['Portuguese', 'French', 'Spanish', 'Italian'], correctIndex: 2 },
  { category: 'Literature', difficulty: 'hard', question: 'Who wrote "One Hundred Years of Solitude"?', options: ['Jorge Luis Borges', 'Gabriel Garcia Marquez', 'Isabel Allende', 'Mario Vargas Llosa'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'hard', question: 'What is the last book of the Bible?', options: ['Jude', 'Revelation', 'Acts', 'Hebrews'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'hard', question: 'Who wrote "The Divine Comedy"?', options: ['Petrarch', 'Boccaccio', 'Dante Alighieri', 'Virgil'], correctIndex: 2 },
  { category: 'Literature', difficulty: 'easy', question: 'What type of animal is Winnie the Pooh?', options: ['Dog', 'Rabbit', 'Bear', 'Pig'], correctIndex: 2 },
  { category: 'Literature', difficulty: 'medium', question: 'Who wrote "The Lord of the Rings"?', options: ['C.S. Lewis', 'J.R.R. Tolkien', 'George R.R. Martin', 'Terry Pratchett'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'hard', question: 'What is the pen name of Samuel Clemens?', options: ['O. Henry', 'Mark Twain', 'Lewis Carroll', 'George Eliot'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'medium', question: 'Who wrote "Brave New World"?', options: ['George Orwell', 'H.G. Wells', 'Aldous Huxley', 'Ray Bradbury'], correctIndex: 2 },
  { category: 'Literature', difficulty: 'hard', question: 'What epic poem tells of the Trojan War?', options: ['The Odyssey', 'The Iliad', 'The Aeneid', 'Beowulf'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'medium', question: 'Who wrote "To Kill a Mockingbird"?', options: ['Harper Lee', 'Truman Capote', 'John Grisham', 'Flannery O\'Connor'], correctIndex: 0 },
  { category: 'Literature', difficulty: 'easy', question: 'How many books are in the "Chronicles of Narnia" series?', options: ['5', '6', '7', '8'], correctIndex: 2 },
  { category: 'Literature', difficulty: 'hard', question: 'Who wrote "War and Peace"?', options: ['Fyodor Dostoevsky', 'Leo Tolstoy', 'Anton Chekhov', 'Ivan Turgenev'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'medium', question: 'What genre is "Dune" by Frank Herbert?', options: ['Fantasy', 'Science Fiction', 'Horror', 'Mystery'], correctIndex: 1 },
  { category: 'Literature', difficulty: 'hard', question: 'Who wrote "The Canterbury Tales"?', options: ['Geoffrey Chaucer', 'Edmund Spenser', 'John Milton', 'William Langland'], correctIndex: 0 },
  { category: 'Literature', difficulty: 'easy', question: 'What is the name of the boy raised by wolves in "The Jungle Book"?', options: ['Baloo', 'Shere Khan', 'Mowgli', 'Bagheera'], correctIndex: 2 },
];

async function seed() {
  const db = getDb();

  const count = db.prepare('SELECT COUNT(*) as c FROM questions').get() as { c: number };
  if (count.c > 0) {
    console.log(`Database already has ${count.c} questions. Clearing and re-seeding...`);
    db.prepare('DELETE FROM questions').run();
  }

  const insert = db.prepare(
    'INSERT INTO questions (id, category, difficulty, question, options, correct_index, time_limit) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  const insertMany = db.transaction((items: SeedQuestion[]) => {
    for (const q of items) {
      insert.run(uuid(), q.category, q.difficulty, q.question, JSON.stringify(q.options), q.correctIndex, 15);
    }
  });

  insertMany(questions);

  const finalCount = db.prepare('SELECT COUNT(*) as c FROM questions').get() as { c: number };
  console.log(`Seeded ${finalCount.c} questions across 8 categories.`);

  // Print breakdown
  const breakdown = db.prepare('SELECT category, COUNT(*) as c FROM questions GROUP BY category').all() as { category: string; c: number }[];
  for (const row of breakdown) {
    console.log(`  ${row.category}: ${row.c}`);
  }
}

seed();
