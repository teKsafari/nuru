--
-- PostgreSQL database dump
--

\restrict B05sGtNHS7X8P34cCV0GHcEc7Lf3iUq4s0jyzq18T5YT52jcQBv7kvSU4oAYJdM

-- Dumped from database version 17.10 (9f6157c)
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.users (id, logto_id, name, email, created_at) VALUES ('694d816b-93bc-4fc9-9206-9d9eb91a5fbbasas', 'system-admin-restoration', 'System Admin', 'admin@example.com', '2026-05-20 00:59:49.81256+00');


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.modules (id, slug, title, difficulty, executor_type, layout_config, organization_id, created_at, "order", visibility, created_by) VALUES ('314a38c4-d435-4283-9b11-b854450558cb', 'misingi-ya-nuru', '{"en": "Nuru Basics", "sw": "Misingi ya Nuru"}', 'mwanzilishi', 'nuru-wasm', '{"canvas": false, "terminal": true}', NULL, '2026-05-20 00:59:50.011248+00', 0, 'public', 'system-admin-restoration');
INSERT INTO public.modules (id, slug, title, difficulty, executor_type, layout_config, organization_id, created_at, "order", visibility, created_by) VALUES ('451c3616-5844-422e-af37-3cd4fa4c57ff', 'vitendakazi-na-mantiki', '{"en": "Functions and Logic", "sw": "Vitendakazi na Mantiki"}', 'wa kati', 'nuru-wasm', '{"canvas": false, "terminal": true}', NULL, '2026-05-20 00:59:51.288641+00', 1, 'public', 'system-admin-restoration');
INSERT INTO public.modules (id, slug, title, difficulty, executor_type, layout_config, organization_id, created_at, "order", visibility, created_by) VALUES ('30a05a13-4345-4304-890c-654e330f7949', 'kujirudia', '{"en": "Recursion", "sw": "Kujirudia (Recursion)"}', 'wa kati', 'nuru-wasm', '{"canvas": false, "terminal": true}', NULL, '2026-05-20 00:59:52.162396+00', 2, 'public', 'system-admin-restoration');
INSERT INTO public.modules (id, slug, title, difficulty, executor_type, layout_config, organization_id, created_at, "order", visibility, created_by) VALUES ('4cf86550-82b2-4372-adad-348f00aa6cf4', 'kanuni-za-upangaji', '{"en": "Sorting Algorithms", "sw": "Kanuni za Upangaji"}', 'wa juu', 'nuru-wasm', '{"canvas": false, "terminal": true}', NULL, '2026-05-20 00:59:53.62941+00', 4, 'public', 'system-admin-restoration');
INSERT INTO public.modules (id, slug, title, difficulty, executor_type, layout_config, organization_id, created_at, "order", visibility, created_by) VALUES ('f8d93c6d-184b-47c4-811a-ee1f310ddf31', 'suluhisho-sudoku', '{"en": "Sudoku Solver", "sw": "Suluhisho la Sudoku"}', 'wa juu', 'nuru-wasm', '{"canvas": false, "terminal": true}', NULL, '2026-05-20 00:59:54.255177+00', 5, 'public', 'system-admin-restoration');
INSERT INTO public.modules (id, slug, title, difficulty, executor_type, layout_config, organization_id, created_at, "order", visibility, created_by) VALUES ('e9217ef6-692e-4585-8b20-902bab3c433d', 'fibonacci', '{"en": "Fibonacci Sequence", "sw": "Fibonacci Sequence"}', 'hard', 'nuru-wasm', '{"canvas": false, "terminal": true}', NULL, '2026-05-20 00:59:52.936022+00', 3, 'private', 'system-admin-restoration');


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('7e992603-1490-47a4-a116-e95ccde264f3', '314a38c4-d435-4283-9b11-b854450558cb', 'unda', '{"en": "13. Functions", "sw": "13. Functions"}', '{"en": "Functions are pieces of code that you can call at any time. We use the word `unda` to create a function.\n\n### Why use functions?\n1. To simplify repetitive tasks.\n2. To make code cleaner.\n\n### Example:\n```nuru\nfanya square = +++unda(n)+++ {\n    +++rudisha n * n+++\n}\n\nandika(square(5))  // 25\nandika(square(10)) // 100\n```\n\n**Your Task:** Create a function `jumla` that takes two numbers `a` and `b` and returns their sum.\n\n```nuru\nfanya jumla = unda(a, b) {\n    +++rudisha a + b+++\n}\n```", "sw": "Functions are pieces of code that you can call at any time. We use the word `unda` to create a function.\n\n### Why use functions?\n1. To simplify repetitive tasks.\n2. To make code cleaner.\n\n### Example:\n```nuru\nfanya square = +++unda(n)+++ {\n    +++rudisha n * n+++\n}\n\nandika(square(5))  // 25\nandika(square(10)) // 100\n```\n\n**Your Task:** Create a function `jumla` that takes two numbers `a` and `b` and returns their sum.\n\n```nuru\nfanya jumla = unda(a, b) {\n    +++rudisha a + b+++\n}\n```"}', '{"en": "Create a function `jumla` that takes `a` and `b` and returns their sum.", "sw": "Create a function `jumla` that takes `a` and `b` and returns their sum."}', 'fanya jumla = unda(a, b) {
    // Andika kodi yako hapa
}

andika(jumla(5, 7))
', 'fanya jumla = unda(a, b) {
    rudisha a + b
}

andika(jumla(5, 7))
', '[{"id": "misingi_unda_1", "type": "match_code", "message": "You must define a function using ''unda'' / Lazima uunde kitendakazi ukitumia ''unda''", "pattern": "unda\\s+", "isPublic": true}]', 12, '2026-05-20 00:59:51.204047+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('c636031a-485e-4770-a1a0-59c9122b3d8f', '314a38c4-d435-4283-9b11-b854450558cb', 'vibadilika', '{"en": "4. Variables", "sw": "4. Vibadilika (Variables)"}', '{"en": "A variable is like a box that you use to store information. You give that box a name so you can use it later.\n\nWe use the `=` sign to assign a value to a variable. You can use the word `fanya` to initialize a new variable for the first time.\n\n### Naming rules:\n- It must start with a letter.\n- It must not start with a number.\n- Case sensitivity matters (`name` is different from `Name`).\n\n### Example:\n```nuru\nfanya mwanzo = +++10+++\nmwisho = +++20+++\nandika(+++mwanzo + mwisho+++)\n```", "sw": "Kibadilika ni kama sanduku ambalo unatumia kuhifadhi taarifa. Unakipa sanduku hilo jina ili uweze kulitumia baadaye.\n\nTunatumia alama ya `=` kumpa kibadilika thamani. Unaweza kutumia neno `fanya` kuanzisha kibadilika kipya kwa mara ya kwanza.\n\n### Sheria za majina:\n- Lazima lianze na herufi.\n- Lisianze na namba.\n- Herufi kubwa na ndogo ni tofauti (`jina` ni tofauti na `Jina`).\n\n### Mfano:\n```nuru\nfanya mwanzo = +++10+++\nmwisho = +++20+++\nandika(+++mwanzo + mwisho+++)\n```"}', '{"en": "Create two variables: `mwanzo = 10` and `mwisho = 20`, then print their sum.", "sw": "Tengeneza vibadilika viwili: `mwanzo = 10` na `mwisho = 20`, kisha andika jumla yao."}', 'fanya mwanzo = 
mwisho = 
andika()
', 'fanya mwanzo = 10
mwisho = 20
andika(mwanzo + mwisho)', '[{"id": "misingi_vibadilika_1", "type": "match_code", "message": "You must initialize ''mwanzo'' to 10 / Lazima uanzishe ''mwanzo'' kuwa 10", "pattern": "mwanzo\\s*=\\s*10", "isPublic": true}, {"id": "misingi_vibadilika_2", "type": "match_code", "message": "You must initialize ''mwisho'' to 20 / Lazima uanzishe ''mwisho'' kuwa 20", "pattern": "mwisho\\s*=\\s*20", "isPublic": true}, {"id": "misingi_vibadilika_3", "type": "exact_output", "message": "The output must be the sum of 10 and 20 (30) / Matokeo lazima yawe jumla ya 10 na 20 (30)", "isPublic": true, "expectedOutput": "30\n"}]', 3, '2026-05-20 00:59:50.41345+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('41a8b6d8-6504-409a-bd9e-1bd35a1a0419', '314a38c4-d435-4283-9b11-b854450558cb', 'jaza', '{"en": "8. Getting Input (jaza)", "sw": "8. Kupata Ingizo (Input)"}', '{"en": "The `jaza()` function allows you to get information from the user. The computer will pause and wait until the user types something.\n\n**Important**: The value returned by `jaza()` is always a **String** (text).\n\n### Task:\n```nuru\nchakula = +++jaza(\"Wali\")+++\nandika(+++chakula+++)\n```\n\nIf you want a number, you will have to convert it (we''ll learn this later).", "sw": "Kitendakazi cha `jaza()` kinakuwezesha kupata taarifa kutoka kwa mtumiaji. Kompyuta itasimama na kusubiri mpaka mtumiaji aandike kitu.\n\n**Muhimu**: Thamani inayorudishwa na `jaza()` kila mara ni **Tungo** (maandishi).\n\n### Zoezi:\n```nuru\nchakula = +++jaza(\"Wali\")+++\nandika(+++chakula+++)\n```\n\nIkiwa unataka namba, itabidi uibadilishe (tutajifunza hili baadaye)."}', '{"en": "Use `jaza()` to ask the user for their favorite food, then print it.", "sw": "Tumia `jaza()` kuuliza mtumiaji chakula anachopenda, kisha kichapishe."}', 'chakula = 
andika()
', 'chakula = jaza("Wali")
andika(chakula)', '[{"id": "misingi_jaza_1", "type": "match_code", "message": "You must use the ''jaza()'' function to get user input / Lazima utumie kitendakazi cha ''jaza()'' kuchukua pembejeo ya mtumiaji", "pattern": "jaza\\(\\)", "isPublic": true}]', 7, '2026-05-20 00:59:50.768914+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('354bf741-7ac0-4bc7-a5ee-b5dcf3c6fa99', '451c3616-5844-422e-af37-3cd4fa4c57ff', 'pure-functions', '{"en": "6. Pure Functions", "sw": "6. Vitendakazi Safi (Pure Functions)"}', '{"en": "A **Pure Function** is a very important concept.\n1. It **always** gives the same output for the same input.\n2. It **never** changes variables outside itself (no \"side effects\").\n\n### Pure vs Impure Example:\n```s\n// IMPURE (Unpredictable)\nfanya total = 0\nfanya add = unda(x) {\n    total = total + x // Changing something OUTSIDE\n}\n\n// PURE (Safe and Predictable)\nfanya add_pure = +++unda(x, y) {\n    rudisha x + y // Just calculating and returning\n}+++\n```\n\nPure functions make your code much easier to test and reason about because they are isolated!\n\n**Your Task:** Rewrite `ongeza_mbili` to be a pure function. It should take a number and return that number plus 2.\n\n```s\nfanya namba_yangu = 10\n\nfanya ongeza_mbili = +++unda(x) {\n    rudisha x + 2\n}+++\n\n+++andika(ongeza_mbili(namba_yangu))+++\n```", "sw": "**Kitendakazi Safi** (Pure Function) ni dhana muhimu sana.\n1. Kila wakati kinaleta matokeo yale yale kwa pembejeo (input) ile ile.\n2. **Kamwe** hakibadilishi vibadilika vilivyo nje yake (hakuna mabadiliko ya nje yasiyotarajiwa).\n\n### Mfano: Safi dhidi ya Isiyo Safi:\n```s\n// ISIYO SAFI (Haitabiriki)\nfanya jumla = 0\nfanya ongeza = unda(x) {\n    jumla = jumla + x // Kinabadilisha kitu cha NJE\n}\n\n// SAFI (Salama na Inatabirika)\nfanya ongeza_safi = +++unda(x, y) {\n    rudisha x + y // Kinapiga hesabu na kurudisha tu\n}+++\n```\n\nVitendakazi safi vinafanya kodi yako kuwa rahisi kuipima na kuielewa kwa sababu vimejitenga na ulimwengu wa nje.\n\n**Kazi Yako:** Andika upya `ongeza_mbili` ili kiwe kitendakazi safi. Kinapaswa kuchukua namba na kurudisha namba hiyo jumlisha 2.\n\n```s\nfanya namba_yangu = 10\n\nfanya ongeza_mbili = +++unda(x) {\n    rudisha x + 2\n}+++\n\n+++andika(ongeza_mbili(namba_yangu))+++\n```"}', '{"en": "Fix the `ongeza_mbili` function so it takes an argument and returns a new value instead of changing the global variable.", "sw": "Rekebisha kitendakazi `ongeza_mbili` ili kipokee hoja (argument) na kurudisha thamani mpya badala ya kubadilisha kibadilika cha nje."}', '// Bad practice: Relying on global variables
fanya namba_yangu = 10

// Fix this function! It should take ''x'' and rudisha ''x + 2''
fanya ongeza_mbili = unda() {
    namba_yangu = namba_yangu + 2
}

ongeza_mbili()
andika(namba_yangu) // This is unpredictable!
', 'fanya namba_yangu = 10

fanya ongeza_mbili = unda(x) {
    rudisha x + 2
}

andika(ongeza_mbili(namba_yangu)) // Predictable!
', '[{"id": "vitendakazi_pure_functions_1", "type": "match_code", "message": "The function ''ongeza_mbili'' must be pure: accept an argument and return the value plus 2. / Kitendakazi ''ongeza_mbili'' lazima kiwe safi: kupokea argument na kurudisha thamani jumlisha 2.", "pattern": "\\bfanya\\s+ongeza_mbili\\s*=\\s*unda\\s*\\(\\s*[a-zA-Z_][a-zA-Z0-9_]*\\s*\\)\\s*\\{[^}]*\\brudisha\\s+[a-zA-Z_][a-zA-Z0-9_]*\\s*\\+\\s*2", "isPublic": true}, {"id": "vitendakazi_pure_functions_2", "type": "match_output", "message": "The output must be ''12''. / Matokeo lazima yawe ''12''.", "pattern": "^12\\s*$", "isPublic": true}]', 5, '2026-05-20 00:59:51.807924+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('914a4160-bbb4-4d15-b580-457feb1f982b', '451c3616-5844-422e-af37-3cd4fa4c57ff', 'closures', '{"en": "8. Returning Functions (Closures)", "sw": "8. Kurudisha Vitendakazi (Closures)"}', '{"en": "Just like we can pass functions *into* other functions, we can also **return** a function from a function!\n\nThis is often used to create specialized \"factory\" functions.\n\n### Example:\n```s\nfanya ubao = unda(rangi) {\n    // This function ''remembers'' the rangi!\n    rudisha unda() {\n        andika(\"Kuchora kwa rangi ya\", rangi)\n    }\n}\n\nfanya chora_nyekundu = ubao(\"Nyekundu\")\nchora_nyekundu() // Prints: Kuchora kwa rangi ya Nyekundu\n```\n\nThis is called a **Closure** because the inner function \"closes over\" and remembers the variables from the outer function even after the outer function finishes.\n\n**Your Task:** Get the inner function by writing `fanya sema_jambo = tengeneza_salamu()` and then run it by calling `sema_jambo()`!\n\n```s\nfanya tengeneza_salamu = unda() {\n    rudisha unda() {\n        andika(\"Jambo kutoka ndani!\")\n    }\n}\n\n+++fanya sema_jambo = tengeneza_salamu()+++\n+++sema_jambo()+++\n```", "sw": "Kama tunavyoweza kupitisha vitendakazi *ndani* ya vitendakazi vingine, tunaweza pia **kurudisha** kitendakazi kutoka kwenye kitendakazi kingine!\n\nHii mara nyingi hutumiwa kutengeneza mifumo maalum ambapo kitendakazi kimoja kinazalisha kingine.\n\n### Mfano:\n```s\nfanya ubao = unda(rangi) {\n    // Kitendakazi hiki ''kinakumbuka'' rangi!\n    rudisha unda() {\n        andika(\"Kuchora kwa rangi ya\", rangi)\n    }\n}\n\nfanya chora_nyekundu = ubao(\"Nyekundu\")\nchora_nyekundu() // Inaandika: Kuchora kwa rangi ya Nyekundu\n```\n\nHii inaitwa **Kufungwa** (Closure) kwa sababu kitendakazi cha ndani \"kinakumbatia\" na kukumbuka vibadilika vya kitendakazi cha nje hata baada ya kitendakazi cha nje kumaliza kazi yake.\n\n**Kazi Yako:** Pata kitendakazi cha ndani kwa kuandika `fanya sema_jambo = tengeneza_salamu()` na kisha kiendeshe kwa kuandika `sema_jambo()`!\n\n```s\nfanya tengeneza_salamu = unda() {\n    rudisha unda() {\n        andika(\"Jambo kutoka ndani!\")\n    }\n}\n\n+++fanya sema_jambo = tengeneza_salamu()+++\n+++sema_jambo()+++\n```"}', '{"en": "Call `tengeneza_salamu()` and save it in a variable called `sema_jambo`, then call `sema_jambo()`.", "sw": "Ita `tengeneza_salamu()` na uihifadhi kwenye kibadilika kinachoitwa `sema_jambo`, kisha ita `sema_jambo()`."}', 'fanya tengeneza_salamu = unda() {
    // This function returns another function!
    rudisha unda() {
        andika("Jambo kutoka ndani!")
    }
}

// 1. Get the new function
// fanya sema_jambo = ?

// 2. Call the new function
// ?
', 'fanya tengeneza_salamu = unda() {
    rudisha unda() {
        andika("Jambo kutoka ndani!")
    }
}

fanya sema_jambo = tengeneza_salamu()
sema_jambo()
', '[{"id": "vitendakazi_closures_1", "type": "match_code", "message": "You must assign the inner function of ''tengeneza_salamu'' to ''sema_jambo''. / Lazima uhifadhi kitendakazi cha ndani cha ''tengeneza_salamu'' kwenye ''sema_jambo''.", "pattern": "\\bfanya\\s+sema_jambo\\s*=\\s*tengeneza_salamu\\s*\\(\\s*\\)", "isPublic": true}, {"id": "vitendakazi_closures_2", "type": "match_output", "message": "The output must contain ''Jambo kutoka ndani!''. / Matokeo lazima yawe na ''Jambo kutoka ndani!''.", "pattern": "Jambo kutoka ndani!", "isPublic": true}]', 7, '2026-05-20 00:59:51.988938+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('837d1f0a-f777-4586-a76b-c0978c885cb1', '30a05a13-4345-4304-890c-654e330f7949', 'power-challenge', '{"en": "8. Challenge: Power Function", "sw": "8. Changamoto: Kitendakazi cha Peo (Power)"}', '{"en": "Let''s put your recursion skills to the test!\n\nYou need to write a function that calculates exponents, like $x^y$ (x to the power of y).\nFor example, `2^3` is `2 * 2 * 2`.\n\n### The Logic:\nThink about it: $2^3$ is just $2 * 2^2$.\nAnd $2^2$ is just $2 * 2^1$.\nAnd $2^0$ is always **1**. This is your Base Case!\n\n### Final Tip:\nAlways make sure you are changing the argument in each step (e.g., `y - 1`) so you eventually reach the Base Case (`y == 0`).\n\n**Your Task:** Complete the `peo` function. Write +++rudisha 1+++ inside the Base Case and +++rudisha x * peo(x, y - 1)+++ for the Recursive Step.\n\n```nuru\nfanya peo = unda(x, y) {\n    kama (y == 0) {\n        +++rudisha 1+++\n    }\n    \n    +++rudisha x * peo(x, y - 1)+++\n}\n\nandika(\"2^3 ni:\", peo(2, 3))\nandika(\"5^2 ni:\", peo(5, 2))\n```", "sw": "Hebu tupime ujuzi wako wa kujirudia!\n\nUnahitaji kuandika kitendakazi kinachokokotoa vipeo, kama $x^y$ (x kwa peo ya y).\nKwa mfano, `2^3` ni `2 * 2 * 2`.\n\n### Mantiki Yake:\nFikiria hivi: $2^3$ ni sawa na $2 * 2^2$.\nNa $2^2$ ni sawa na $2 * 2^1$.\nNa $2^0$ kila wakati ni **1**. Hii ndiyo Kesi yako ya Msingi!\n\n### Kidokezo cha Mwisho:\nDaima hakikisha unabadilisha hoja katika kila hatua (mfano, `y - 1`) ili hatimaye ufikie Kesi ya Msingi (`y == 0`).\n\n**Kazi Yako:** Kamilisha kitendakazi cha `peo`. Andika +++rudisha 1+++ ndani ya Kesi ya Msingi na +++rudisha x * peo(x, y - 1)+++ kwa ajili ya Hatua ya Kujirudia.\n\n```nuru\nfanya peo = unda(x, y) {\n    kama (y == 0) {\n        +++rudisha 1+++\n    }\n    \n    +++rudisha x * peo(x, y - 1)+++\n}\n\nandika(\"2^3 ni:\", peo(2, 3))\nandika(\"5^2 ni:\", peo(5, 2))\n```"}', '{"en": "Write a recursive function `peo(x, y)` that calculates ''x to the power of y'' (x^y).", "sw": "Andika kitendakazi kinachojirudia `peo(x, y)` kinachokokotoa ''x kwa peo ya y'' (x^y)."}', 'fanya peo = unda(x, y) {
    // Base Case: Any number to the power of 0 is 1.
    kama (y == 0) {
        
    }
    
    // Recursive step: Multiply x by the power of (x, y - 1)
    rudisha 
}

andika("2^3 ni:", peo(2, 3)) // Should be 8 (2 * 2 * 2)
andika("5^2 ni:", peo(5, 2)) // Should be 25 (5 * 5)
', 'fanya peo = unda(x, y) {
    kama (y == 0) {
        rudisha 1
    }
    rudisha x * peo(x, y - 1)
}

andika("2^3 ni:", peo(2, 3))
andika("5^2 ni:", peo(5, 2))
', '[{"id": "kujirudia_power_output", "type": "io", "message": "The program must print 8 for 2 raised to the power of 3. / Programu lazima ichapishe 8 kwa 2 iliyofanywa kipeo cha 3.", "isPublic": true, "expectedOutput": "8"}, {"id": "kujirudia_power_recurse", "type": "match_code", "message": "The power function should recursively call itself. / Kitendakazi cha power kinapaswa kujiita chenyewe.", "pattern": "power\\s*\\(.*\\)", "isPublic": true}]', 7, '2026-05-20 00:59:52.850382+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('0cda984c-b6e4-4637-8154-081f32ce93f3', 'e9217ef6-692e-4585-8b20-902bab3c433d', 'fast-fibo', '{"en": "7. Fast Fibonacci", "sw": "7. Fibonacci ya Haraka"}', '{"en": "Congratulations! You''ve mastered one of the most classic challenges in programming.\n\n### What you learned:\n1. **Recursion:** A function can call itself to solve a complex problem.\n2. **Double Recursion:** One call can branch into two, creating a tree.\n3. **Performance:** Recursion can be slow if it repeats work.\n4. **Memoization:** Storing results in memory makes your code thousands of times faster.\n\n**Your Task:** Run the code for `fibo(40)` by using `andika(fibo(40))`. Without memoization, this would take billions of steps and probably crash your browser. With memoization, it''s finished before you can blink!\n\n```nuru\nandika(\"Calculating fibo(40) instantly...\")\n+++andika(fibo(40))+++\n```", "sw": "Hongera! Umemudu moja ya changamoto za kizamani zaidi katika upangaji programu.\n\n### Ulichojifunza:\n1. **Kujirudia (Recursion):** Kitendakazi kinaweza kujiita chenyewe ili kutatua tatizo gumu.\n2. **Kujirudia Mara Mbili:** Wito mmoja unaweza kugawanyika mara mbili, na kutengeneza mti.\n3. **Utendaji (Performance):** Kujirudia kunaweza kuwa polepole ikiwa kunarudia kazi.\n4. **Memoization:** Kuhifadhi matokeo kwenye kumbukumbu kunafanya kodi yako iwe na kasi mara maelfu zaidi.\n\n**Kazi Yako:** Endesha kodi kwa ajili ya `fibo(40)` kwa kutumia `andika(fibo(40))`. Bila memoization, hii ingechukua mabilioni ya hatua na pengine ingekwama. Kwa memoization, inamaliza kabla hata hujapepesa jicho!\n\n```nuru\nandika(\"Inakokotoa fibo(40) kwa haraka...\")\n+++andika(fibo(40))+++\n```"}', '{"en": "Run the optimized code for `fibo(40)`. Notice how it''s now instant!", "sw": "Endesha kodi iliyoboreshwa ya `fibo(40)`. Angalia jinsi sasa inavyotokea papo hapo!"}', 'fanya kumbukumbu = {}

fanya fibo = unda(n) {
    kama (n <= 1) { rudisha n }
    kama (kumbukumbu[n] != tupu) {
        rudisha kumbukumbu[n]
    }

    fanya jibu = fibo(n - 1) + fibo(n - 2)
    kumbukumbu[n] = jibu
    rudisha jibu
}

andika("Calculating fibo(40) instantly...")
// andika matokeo ya fibo(40) hapa
', 'fanya kumbukumbu = {}

fanya fibo = unda(n) {
    kama (n <= 1) { rudisha n }
    kama (kumbukumbu[n] != tupu) {
        rudisha kumbukumbu[n]
    }

    fanya jibu = fibo(n - 1) + fibo(n - 2)
    kumbukumbu[n] = jibu
    rudisha jibu
}

andika("Calculating fibo(40) instantly...")
andika(fibo(40))
', '[{"id": "fibo_fast_output_msg", "type": "match_output", "message": "The printed message must say ''Calculating fibo(40) instantly...'' / Ujumbe uliochapishwa lazima useme ''Calculating fibo(40) instantly...''", "pattern": "Calculating fibo\\(40\\) instantly\\.\\.\\.", "isPublic": true}, {"id": "fibo_fast_output_val", "type": "match_output", "message": "The printed result must be 102334155 / Tokeo lililochapishwa lazima liwe 102334155", "pattern": "102334155\\b", "isPublic": true}, {"id": "fibo_fast_code_call", "type": "match_code", "message": "You must call and print `fibo(40)` using `andika(fibo(40))` / Lazima uite na uchapishe `fibo(40)` kwa kutumia `andika(fibo(40))`", "pattern": "andika\\s*\\(\\s*fibo\\s*\\(\\s*40\\s*\\)\\s*\\)", "isPublic": true}]', 6, '2026-05-20 00:59:53.543647+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('fd1fce80-af9f-41e3-abac-aec53dea461b', '4cf86550-82b2-4372-adad-348f00aa6cf4', 'merge-logic', '{"en": "4. The Merge (Combining)", "sw": "4. Unganisho (The Merge)"}', '{"en": "After we split the lists down to size 1, we need to put them back together in the correct order. This is the **Merge** step.\n\n### How it works:\n1. Look at the first item of both lists.\n2. Pick the smaller one and put it in our `matokeo` (result) list.\n3. Repeat until one list is empty!\n\n**Your Task:** Complete the `sivyo` block. If `b[0]` is smaller (or equal) to `a[0]`, add it to the `matokeo` and remove it from `b`. (Note: `.sukuma()` adds an item to an array, and `+` joins two arrays).\n\n```nuru\nfanya unganisha = unda(a, b) {\n    fanya matokeo = []\n    wakati (a.idadi() > 0 && b.idadi() > 0) {\n        kama (a[0] < b[0]) {\n            matokeo.sukuma(a[0])\n            a = kata(a, 1)\n        } sivyo {\n            +++matokeo.sukuma(b[0])+++\n            +++b = kata(b, 1)+++\n        }\n    }\n    rudisha matokeo + a + b\n}\n\nandika(unganisha([1, 5], [2, 10]))\n```", "sw": "Baada ya kuigawanya orodha hadi ukubwa wa 1, tunahitaji kuziweka pamoja kwa mpangilio sahihi. Hii ndiyo hatua ya **Kuunganisha** (Merge).\n\n### Jinsi inavyofanya kazi:\n1. Angalia kitu cha kwanza cha orodha zote mbili.\n2. Chagua kile kidogo zaidi na ukiweke kwenye orodha yetu ya `matokeo`.\n3. Rudia hadi orodha moja iwe tupu!\n\n**Kazi Yako:** Kamilisha kizuizi cha `sivyo`. Ikiwa `b[0]` ni ndogo kuliko (au sawa na) `a[0]`, iongeze kwenye `matokeo` na uiondoe kwenye `b`. (Kumbuka: `.sukuma()` huongeza kitu kwenye safu, na `+` huunganisha safu mbili).\n\n```nuru\nfanya unganisha = unda(a, b) {\n    fanya matokeo = []\n    wakati (a.idadi() > 0 && b.idadi() > 0) {\n        kama (a[0] < b[0]) {\n            matokeo.sukuma(a[0])\n            a = kata(a, 1)\n        } sivyo {\n            +++matokeo.sukuma(b[0])+++\n            +++b = kata(b, 1)+++\n        }\n    }\n    rudisha matokeo + a + b\n}\n\nandika(unganisha([1, 5], [2, 10]))\n```"}', '{"en": "Complete the `unganisha` function to combine two sorted lists into one big sorted list.", "sw": "Kamilisha kitendakazi cha `unganisha` ili kuunganisha orodha mbili zilizopangwa kuwa orodha moja kubwa iliyopangwa."}', '// Kisaidizi cha kukata orodha (Helper to slice arrays)
fanya kata = unda(orodha, anza, mwisho = -1) {
    kama (mwisho == -1) { mwisho = orodha.idadi() }
    fanya mpya = []
    kwa i, t ktk orodha { kama (i >= anza && i < mwisho) { mpya.sukuma(t) } }
    rudisha mpya
}


fanya unganisha = unda(a, b) {
    fanya matokeo = []
    
    wakati (a.idadi() > 0 && b.idadi() > 0) {
        kama (a[0] < b[0]) {
            matokeo.sukuma(a[0])
            a = kata(a, 1)
        } sivyo {
            
        }
    }
    
    rudisha matokeo + a + b
}

andika(unganisha([1, 5], [2, 10]))
', '// Kisaidizi cha kukata orodha (Helper to slice arrays)
fanya kata = unda(orodha, anza, mwisho = -1) {
    kama (mwisho == -1) { mwisho = orodha.idadi() }
    fanya mpya = []
    kwa i, t ktk orodha { kama (i >= anza && i < mwisho) { mpya.sukuma(t) } }
    rudisha mpya
}


fanya unganisha = unda(a, b) {
    fanya matokeo = []
    wakati (a.idadi() > 0 && b.idadi() > 0) {
        kama (a[0] < b[0]) {
            matokeo.sukuma(a[0])
            a = kata(a, 1)
        } sivyo {
            matokeo.sukuma(b[0])
            b = kata(b, 1)
        }
    }
    rudisha matokeo + a + b
}

andika(unganisha([1, 5], [2, 10]))
', '[{"id": "sorting_merge_output", "type": "match_output", "message": "The merged list must be in the correct sorted order: [1, 2, 5, 10]. / Orodha iliyounganishwa lazima iwe katika mpangilio sahihi: [1, 2, 5, 10].", "pattern": "\\[\\s*1,\\s*2,\\s*5,\\s*10\\s*\\]", "isPublic": true}, {"id": "sorting_merge_code_sukuma", "type": "match_code", "message": "In the sivyo block, you must push b[0] to matokeo. / Katika kitalu cha ''sivyo'', lazima usukume b[0] kwenye matokeo.", "pattern": "matokeo\\s*\\.\\s*sukuma\\s*\\(\\s*b\\s*\\[\\s*0\\s*\\]\\s*\\)", "isPublic": true}, {"id": "sorting_merge_code_kata", "type": "match_code", "message": "In the sivyo block, you must slice b to avoid an infinite loop. / Katika kitalu cha ''sivyo'', lazima ukate b ili kuepuka kitanzi kisicho na mwisho.", "pattern": "b\\s*=\\s*kata\\s*\\(\\s*b\\s*,\\s*1\\s*\\)", "isPublic": true}]', 3, '2026-05-20 00:59:53.974843+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('9fb9a249-20a7-470e-9ec0-81f59803d3e9', '314a38c4-d435-4283-9b11-b854450558cb', 'kama', '{"en": "7. Conditionals (kama/else if/sivyo)", "sw": "7. Maamuzi (kama/au kama/sivyo)"}', '{"en": "A program can make decisions based on certain conditions using `kama`.\n\n### Structure:\n```s\nkama (condition) {\n    // do this if condition is true\n} au kama (other_condition) {\n    // do this if first condition is false and this one is true\n} sivyo {\n    // do this if all above are false\n}\n```\n\n### Task:\n```nuru\nalama = +++60+++\nkama (+++alama >= 50+++) {\n    andika(\"Umefaulu!\")\n} sivyo {\n    andika(\"Umefeli, jaribu tena.\")\n}\n```", "sw": "Programu inaweza kufanya maamuzi kulingana na hali fulani kwa kutumia `kama`.\n\n### Muundo:\n```s\nkama (hali) {\n    // fanya hapa ikiwa hali ni kweli\n} au kama (hali_nyingine) {\n    // fanya ikiwa hali ya kwanza ni sikweli na hii ni kweli\n} sivyo {\n    // fanya ikiwa zote hapo juu ni sikweli\n}\n```\n\n### Zoezi:\n```nuru\nalama = +++60+++\nkama (+++alama >= 50+++) {\n    andika(\"Umefaulu!\")\n} sivyo {\n    andika(\"Umefeli, jaribu tena.\")\n}\n```"}', '{"en": "Change `alama = 40` and see if the program tells you \"You failed\".", "sw": "Badili `alama = 40` na uone kama programu itakuambia \"Umefeli\"."}', 'alama = 
kama ( ) {
    andika("Umefaulu!")
} sivyo {
    andika("Umefeli, jaribu tena.")
}
', 'alama = 40
kama (alama >= 50) {
    andika("Umefaulu!")
} sivyo {
    andika("Umefeli, jaribu tena.")
}', '[{"id": "misingi_kama_1", "type": "match_code", "message": "You must set ''alama'' to 40 / Lazima uweke ''alama'' kuwa 40", "pattern": "alama\\s*=\\s*40", "isPublic": true}, {"id": "misingi_kama_2", "type": "exact_output", "message": "The output should be ''Umefeli, jaribu tena.'' / Matokeo yanatakiwa kuwa ''Umefeli, jaribu tena.''", "isPublic": true, "expectedOutput": "Umefeli, jaribu tena.\n"}]', 6, '2026-05-20 00:59:50.682435+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('4d7cabf4-d752-4575-bf1b-ce041ec2ee6a', '314a38c4-d435-4283-9b11-b854450558cb', 'andika', '{"en": "2. Outputting Results (andika)", "sw": "2. Kutoa Matokeo (andika)"}', '{"en": "The `andika()` function is used to display information or results on the screen. It is our main way of talking to the user.\n\n### Features of andika():\n1. It takes anything (numbers, text, etc.) and prints it.\n2. You can print multiple things at once by separating them with a comma (`,`).\n3. For text (strings), you must place them inside double quotes (`\" \"`).\n\n### Example:\n```nuru\nandika(+++\"Jina langu ni Amani /n Naishi Dar es Salaam\"+++)\n```", "sw": "Kitendakazi cha `andika()` kinatumika kutoa taarifa au matokeo kwenye skrini. Ni njia yetu kuu ya kuzungumza na mtumiaji.\n\n### Sifa za andika():\n1. Inachukua kitu chochote (namba, maandishi, n.k.) na kukichapisha.\n2. Unaweza kuandika vitu vingi kwa pamoja ukivigawa kwa mkwaju (comma `,`).\n3. Kwa maandishi (tungo), lazima uyaweke ndani ya alama za nukuu `\" \"`.\n\n### Mfano:\n```nuru\nandika(+++\"Jina langu ni Amani /n Naishi Dar es Salaam\"+++)\n```"}', '{"en": "Use `andika()` to print your name and the city you live in on two different lines using `/n`.", "sw": "Tumia `andika()` kuchapisha jina lako na mji unaoishi katika mistari miwili tofauti ukitumia `/n`."}', 'andika()
', '', '[{"id": "misingi_andika_1", "type": "match_output", "flags": "i", "message": "You must include ''Jina langu ni [your name]'' / Lazima ujumuishe ''Jina langu ni [jina lako]''", "pattern": "jina langu ni .+", "isPublic": true}, {"id": "misingi_andika_2", "type": "match_output", "flags": "i", "message": "You must include ''Naishi [your city]'' / Lazima ujumuishe ''Naishi [mji wako]''", "pattern": "naishi .+", "isPublic": true}]', 1, '2026-05-20 00:59:50.232616+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('062c5153-1099-4961-ad6f-7e046d5fe523', '314a38c4-d435-4283-9b11-b854450558cb', 'logic', '{"en": "6. Comparisons and Logic", "sw": "6. Ulinganifu na Mantiki"}', '{"en": "When you want to compare values, you use these operators:\n\n### Comparison Operators:\n- `==` (Equal), `!=` (Not equal), `>` (Greater), `<` (Less), `>=` (Greater or equal), `<=` (Less or equal).\n\n### Logic Operators:\n- `&&` (**And**): True if both are true.\n- `||` (**Or**): True if at least one is true.\n- `!` (**Not**): Inverts `kweli` to `sikweli`.\n\n### Task:\n```nuru\nandika(+++50 > 20 && 10 == 10+++)\n```", "sw": "Unapotaka kulinganisha thamani, unatumia viendeshaji hivi:\n\n### Alama za Ulinganifu:\n- `==` (Sawa), `!=` (Si sawa), `>` (Kubwa), `<` (Ndogo), `>=` (Kubwa au sawa), `<=` (Ndogo au sawa).\n\n### Mantiki (Logic):\n- `&&` (**Na**): Kweli kama zote ni kweli.\n- `||` (**Au**): Kweli kama angalau moja ni kweli.\n- `!` (**Siyo**): Inageuza `kweli` kuwa `sikweli`.\n\n### Zoezi:\n```nuru\nandika(+++50 > 20 && 10 == 10+++)\n```"}', '{"en": "Compare if `50` is greater than `20` **AND** `10` is equal to `10`.", "sw": "Linganisha kama `50` ni kubwa kuliko `20` **NA** `10` ni sawa na `10`."}', 'andika()
', 'andika(50 > 20 && 10 == 10)', '[{"id": "misingi_logic_1", "type": "match_code", "message": "You must check if 50 is greater than 20 AND 10 is equal to 10 / Lazima ulinganishe kama 50 ni kubwa kuliko 20 NA 10 ni sawa na 10", "pattern": "50\\s*>\\s*20\\s*&&\\s*10\\s*==\\s*10", "isPublic": true}, {"id": "misingi_logic_2", "type": "exact_output", "message": "The output must be true (kweli) / Matokeo yanatakiwa kuwa kweli", "isPublic": true, "expectedOutput": "kweli\n"}]', 5, '2026-05-20 00:59:50.593372+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('b180a34e-ac22-4018-a8af-20f45f71c54d', '451c3616-5844-422e-af37-3cd4fa4c57ff', 'review', '{"en": "1. Reviewing Functions", "sw": "1. Kujikumbusha Vitendakazi"}', '{"en": "Welcome back! In the basics, you learned that **Functions** are like small, reusable machines. You define them once, and you can run them as many times as you want.\n\nWe use the keyword `unda` to create a function. \n\n### How it looks:\n```nuru\nfanya piga_kelele = unda() {\n    +++andika(\"AAAH!\")+++\n}\n\n// To run it, we \"call\" it using parentheses:\npiga_kelele()\npiga_kelele()\n```\n\nIn the example above, `piga_kelele()` runs the code inside the curly braces `{ ... }`. Since we called it twice, it would print \"AAAH!\" twice.\n\n**Your Task:** Can you fix the `salamu` machine so it prints `\"Jambo!\"` to the screen?\n\n```nuru\nfanya salamu = unda() {\n    +++andika(\"Jambo!\")+++\n}\n```", "sw": "Karibu tena! Katika misingi ya Nuru, ulijifunza kuwa **Vitendakazi** (Functions) ni kama mashine ndogo unazoweza kuzitumia tena na tena. Unazitengeneza mara moja, na unaweza kuzitumia mara nyingi upendavyo.\n\nTunatumia neno `unda` kutengeneza kitendakazi.\n\n### Inavyoonekana:\n```nuru\nfanya piga_kelele = unda() {\n    +++andika(\"AAAH!\")+++\n}\n\n// Ili kuiendesha, \"tunaiita\" kwa kutumia mabano:\npiga_kelele()\npiga_kelele()\n```\n\nKatika mfano hapo juu, `piga_kelele()` inaendesha kodi iliyo ndani ya mabano ya mawimbi `{ ... }`. Kwa sababu tumeiita mara mbili, itaandika \"AAAH!\" mara mbili.\n\n**Kazi Yako:** Je, unaweza kurekebisha mashine ya `salamu` ili iandike `\"Jambo!\"` kwenye skrini?\n\n```nuru\nfanya salamu = unda() {\n    +++andika(\"Jambo!\")+++\n}\n```"}', '{"en": "Create a function called `salamu` that prints ''Jambo!'' when called.", "sw": "Unda kitendakazi (function) kinachoitwa `salamu` ambacho kinaandika ''Jambo!'' kinapoitwa."}', '// Unda function hapa (Create function here)
fanya salamu = unda() {
    // ?
}

salamu()
', 'fanya salamu = unda() {
    andika("Jambo!")
}

salamu()
', '[{"id": "vitendakazi_review_1", "type": "match_code", "message": "You must define a function named ''salamu'' using ''fanya salamu = unda()''. / Lazima utengeneze kitendakazi kinachoitwa ''salamu'' kwa kutumia ''fanya salamu = unda()''.", "pattern": "\\bfanya\\s+salamu\\s*=\\s*unda\\s*\\(\\s*\\)", "isPublic": true}, {"id": "vitendakazi_review_2", "type": "match_output", "message": "The output must contain ''Jambo!''. / Matokeo lazima yawe ''Jambo!''.", "pattern": "^Jambo!\\s*$", "isPublic": true}]', 0, '2026-05-20 00:59:51.376004+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('4d53233c-6837-45ba-9be0-291d49694d79', '30a05a13-4345-4304-890c-654e330f7949', 'countdown', '{"en": "4. Counting Down", "sw": "4. Kuhesabu Kurudi Nyuma"}', '{"en": "You did it! You built your first fully working recursive function.\n\nA recursive function always has these two essential parts:\n1. **Base Case:** When do I stop? (`kama (n <= 0)`)\n2. **Recursive Step:** How do I get closer to stopping? (`hesabu(n - 1)`)\n\n### Conceptual Example:\nImagine a Russian nesting doll. To find the prize in the middle, you:\n1. Open the current doll.\n2. If it''s the smallest doll (**Base Case**), you take the prize.\n3. If not, you open the next smaller doll (**Recursive Step**).\n\n**Your Task:** Test the power of your function! Change the starting number to `10` at the bottom.\n\n```nuru\nfanya hesabu = unda(n) {\n    kama (n <= 0) {\n        andika(\"Rusha roketi!\")\n        rudisha tupu\n    }\n    \n    andika(n)\n    hesabu(n - 1)\n}\n\nhesabu(+++10+++)\n```", "sw": "Umefanikiwa! Umejenga kitendakazi chako cha kwanza cha kujirudia kinachofanya kazi kikamilifu.\n\nKitendakazi cha kujirudia kila wakati huwa na sehemu hizi mbili muhimu:\n1. **Sharti la Kusimama (Base Case):** Lini nisimame? (`kama (n <= 0)`)\n2. **Hatua ya Kujirudia (Recursive Step):** Ninasongaje karibu na kusimama? (`hesabu(n - 1)`)\n\n### Mfano wa Kifikra:\nFikiria mwanasesere wa Kirusi (nesting doll). Ili kupata zawadi katikati, wewe:\n1. Unafungua mwanasesere wa sasa.\n2. Ikiwa ni mwanasesere mdogo zaidi (**Sharti la Kusimama**), unachukua zawadi.\n3. Ikiwa sivyo, unafungua mwanasesere anayefuata mdogo zaidi (**Hatua ya Kujirudia**).\n\n**Kazi Yako:** Jaribu nguvu ya kitendakazi chako! Badilisha nambari ya kuanzia kuwa `10` hapa chini.\n\n```nuru\nfanya hesabu = unda(n) {\n    kama (n <= 0) {\n        andika(\"Rusha roketi!\")\n        rudisha tupu\n    }\n    \n    andika(n)\n    hesabu(n - 1)\n}\n\nhesabu(+++10+++)\n```"}', '{"en": "Try changing the starting number to `10` and watch the full countdown in action.", "sw": "Jaribu kubadilisha nambari ya kuanzia kuwa `10` na uone hesabu kamili ya kurudi nyuma ikifanya kazi."}', 'fanya hesabu = unda(n) {
    kama (n <= 0) {
        andika("Rusha roketi!")
        rudisha tupu
    }
    
    andika(n)
    hesabu(n - 1)
}

hesabu()
', 'fanya hesabu = unda(n) {
    kama (n <= 0) {
        andika("Rusha roketi!")
        rudisha tupu
    }
    andika(n)
    hesabu(n - 1)
}
hesabu(10)
', '[{"id": "kujirudia_countdown_output", "type": "io", "message": "The program must output numbers from 10 down to 1, followed by ''Rusha roketi!''. / Programu inapaswa kutoa nambari kuanzia 10 hadi 1, kisha ''Rusha roketi!''.", "isPublic": true, "expectedOutput": "10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nRusha roketi!"}, {"id": "kujirudia_countdown_call", "type": "match_code", "message": "You must call ''hesabu(10)''. / Lazima uite ''hesabu(10)''.", "pattern": "\\bhesabu\\s*\\(\\s*10\\s*\\)", "isPublic": true}]', 3, '2026-05-20 00:59:52.504681+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('f82b9f86-5c09-4bbd-96d5-2b6c9fa20393', '30a05a13-4345-4304-890c-654e330f7949', 'the-mirror', '{"en": "1. The Mirror (Infinite Loop)", "sw": "1. Kioo (Kitanzi Kisicho na Mwisho)"}', '{"en": "Have you ever stood between two mirrors and seen an infinite line of reflections?\n\nIn programming, a function can actually call **itself**. This is called **Recursion**. \n\n### The Danger:\nIf a function calls itself without any rule to stop, it will run forever. Eventually, your computer will run out of memory (this is often called a \"Stack Overflow\").\n\n### Example:\n```s\nfanya sema = unda() {\n    andika(\"Habari!\")\n    sema() // Calling itself!\n}\n\nsema() // This will crash!\n```\n\n**Your Task:** Run the code to see it in action. Then, fix it by adding +++//+++ in front of the `kioo()` call inside the function so it only runs once.\n\n```nuru\nfanya kioo = unda() {\n    andika(\"Natazama kwenye kioo...\")\n    +++//+++ kioo() \n}\n\nkioo()\n```", "sw": "Ushawahi kusimama katikati ya vioo viwili na kuona msururu wa picha zisizo na mwisho?\n\nKwenye upangaji programu, kitendakazi kinaweza **kujiita chenyewe**. Hii inaitwa **Kujirudia** (Recursion).\n\n### Hatari Yake:\nIkiwa kitendakazi kitajiita chenyewe bila sheria yoyote ya kusimama, kitakimbia milele. Hatimaye, kompyuta yako itaishiwa kumbukumbu (hii mara nyingi huitwa \"Stack Overflow\").\n\n### Mfano:\n```s\nfanya sema = unda() {\n    andika(\"Habari!\")\n    sema() // Kinajiita chenyewe!\n}\n\nsema() // Hii itasababisha kosa!\n```\n\n**Kazi Yako:** Endesha kodi ili uone inavyofanya kazi. Kisha, kirekebishe kwa kuweka +++//+++ mbele ya mwito wa `kioo()` ndani ya kitendakazi ili kiendeshe mara moja tu.\n\n```nuru\nfanya kioo = unda() {\n    andika(\"Natazama kwenye kioo...\")\n    +++//+++ kioo() \n}\n\nkioo()\n```"}', '{"en": "Run the code and see what happens when a function calls itself forever. Then fix it by commenting out the `kioo()` call inside.", "sw": "Endesha kodi uone nini kinatokea wakati kitendakazi kinajiita chenyewe milele. Kisha kirekebishe kwa kuweka alama ya // mbele ya `kioo()` ndani yake."}', 'fanya kioo = unda() {
    andika("Natazama kwenye kioo...")
    kioo() 
}

kioo()
', 'fanya kioo = unda() {
    andika("Natazama kwenye kioo...")
    // kioo()
}

kioo()
', '[{"id": "kujirudia_mirror_output", "type": "io", "message": "The program must output ''Natazama kwenye kioo...'' exactly once. / Programu inapaswa kutoa ''Natazama kwenye kioo...'' mara moja tu.", "isPublic": true, "expectedOutput": "Natazama kwenye kioo..."}, {"id": "kujirudia_mirror_func_def", "type": "match_code", "message": "Make sure you define the function ''kioo'' using ''fanya kioo = unda()''. / Hakikisha unatafsiri utendaji ''kioo'' kwa kutumia ''fanya kioo = unda()''.", "pattern": "fanya\\s+kioo\\s*=\\s*unda\\s*\\(\\s*\\)", "isPublic": true}, {"id": "kujirudia_mirror_func_call", "type": "match_code", "message": "Make sure you call the function ''kioo()''. / Hakikisha unaita utendaji ''kioo()''.", "pattern": "\\bkioo\\s*\\(\\s*\\)", "isPublic": true}]', 0, '2026-05-20 00:59:52.249089+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('9594e4af-c2d5-453e-bc56-ee867730f946', '30a05a13-4345-4304-890c-654e330f7949', 'factorial', '{"en": "6. Math with Recursion: Factorial", "sw": "6. Hesabu na Kujirudia: Factorial"}', '{"en": "Recursion is fantastic for mathematical calculations. \n\nA **Factorial** (written as `n!`) means multiplying a number by every whole number below it. For example, `5! = 5 * 4 * 3 * 2 * 1 = 120`.\n\n### The Pattern:\nNotice how `5!` is actually just `5 * 4!`. \nAnd `4!` is `4 * 3!`.\nThis is a perfect recursive pattern!\n\n### Example:\n```s\nfanya fact = unda(n) {\n    kama (n == 1) { rudisha 1 }\n    rudisha n * fact(n - 1)\n}\n```\n\n**Your Task:** Complete the `factorial` function by writing +++rudisha n * factorial(n - 1)+++. Can you see how it multiplies all the numbers?\n\n```nuru\nfanya factorial = unda(n) {\n    kama (n <= 1) {\n        rudisha 1\n    }\n    \n    +++rudisha n * factorial(n - 1)+++\n}\n\nandika(\"5! ni:\", factorial(5))\n```", "sw": "Kujirudia ni kuzuri sana kwa hesabu za kihisabati.\n\n**Factorial** (iliyoandikwa kama `n!`) inamaanisha kuzidisha namba kwa kila namba nzima iliyo chini yake. Kwa mfano, `5! = 5 * 4 * 3 * 2 * 1 = 120`.\n\n### Mfumo Wake:\nAngalia jinsi `5!` ilivyo sawa na `5 * 4!`.\nNa `4!` ni sawa na `4 * 3!`.\nHuu ni mfumo bora wa kujirudia!\n\n### Mfano:\n```s\nfanya fact = unda(n) {\n    kama (n == 1) { rudisha 1 }\n    rudisha n * fact(n - 1)\n}\n```\n\n**Kazi Yako:** Kamilisha kitendakazi cha `factorial` kwa kuandika +++rudisha n * factorial(n - 1)+++. Je, unaweza kuona jinsi inavyozidisha namba zote?\n\n```nuru\nfanya factorial = unda(n) {\n    kama (n <= 1) {\n        rudisha 1\n    }\n    \n    +++rudisha n * factorial(n - 1)+++\n}\n\nandika(\"5! ni:\", factorial(5))\n```"}', '{"en": "Complete the `factorial` function. Multiply `n` by the result of `factorial(n - 1)`.", "sw": "Kamilisha kitendakazi `factorial`. Zidisha `n` kwa matokeo ya `factorial(n - 1)`."}', 'fanya factorial = unda(n) {
    // Base Case: 1! is just 1
    kama (n <= 1) {
        rudisha 1
    }
    
    // Recursive Step: n * (n-1)!
    rudisha 
}

andika("5! ni:", factorial(5)) // Should be 120
', 'fanya factorial = unda(n) {
    kama (n <= 1) {
        rudisha 1
    }
    rudisha n * factorial(n - 1)
}

andika("5! ni:", factorial(5))
', '[{"id": "kujirudia_factorial_output", "type": "io", "message": "The program must print ''5! ni: 120''. / Programu lazima ichapishe ''5! ni: 120''.", "isPublic": true, "expectedOutput": "5! ni: 120"}, {"id": "kujirudia_factorial_recurse", "type": "match_code", "message": "You must return n multiplied by factorial(n - 1). / Lazima urudishe n ikizidishwa kwa factorial(n - 1).", "pattern": "rudisha\\s+n\\s*\\*\\s*factorial\\s*\\(\\s*n\\s*-\\s*1\\s*\\)", "isPublic": true}]', 5, '2026-05-20 00:59:52.675926+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('d143af5f-0ea8-4585-b187-6a777d1d4ce2', 'e9217ef6-692e-4585-8b20-902bab3c433d', 'base-cases', '{"en": "2. The Starting Point (Base Cases)", "sw": "2. Hatua ya Kuanzia (Kesi za Msingi)"}', '{"en": "Remember: A recursive function needs a **Base Case** to stop it from looping forever.\n\nFor Fibonacci, we actually need **two** base cases because the calculation always relies on the *two* previous numbers. If we reach the very beginning (0 or 1), we can''t look back any further.\n\n### The Rule:\n- Fibonacci of 0 is **0**.\n- Fibonacci of 1 is **1**.\n\n**Your Task:** Complete the base cases for the `fibo` function so it can correctly return 0 and 1.\n\n```nuru\nfanya fibo = unda(n) {\n    +++kama (n == 0) { rudisha 0 }+++\n    +++kama (n == 1) { rudisha 1 }+++\n    \n    rudisha // ...\n}\n```", "sw": "Kumbuka: Kitendakazi kinachojirudia kinahitaji **Kesi ya Msingi** ili kukizuia kisijirudie milele.\n\nKwa Fibonacci, tunahitaji **Kesi mbili za Msingi** kwa sababu hesabu hiyo kila wakati inategemea namba *mbili* zilizotangulia. Tukifika mwanzoni kabisa (0 au 1), hatuwezi kuangalia nyuma zaidi.\n\n### Sheria:\n- Fibonacci ya 0 ni **0**.\n- Fibonacci ya 1 ni **1**.\n\n**Kazi Yako:** Kamilisha kesi za msingi kwa kitendakazi cha `fibo` ili kiweze kurudisha 0 na 1 kwa usahihi.\n\n```nuru\nfanya fibo = unda(n) {\n    +++kama (n == 0) { rudisha 0 }+++\n    +++kama (n == 1) { rudisha 1 }+++\n    \n    rudisha // ...\n}\n```"}', '{"en": "Add two `kama` (if) statements to return `n` if `n == 0` or `n == 1`.", "sw": "Ongeza sentensi mbili za `kama` (if) ili kurudisha `n` ikiwa `n == 0` au `n == 1`."}', 'fanya fibo = unda(n) {
    // 1. Base Case for 0: If n is 0, rudisha 0
    // kama (n == 0) { rudisha 0 }
    
    // 2. Base Case for 1: If n is 1, rudisha 1
    // kama (n == 1) { rudisha 1 }
    
    rudisha // still working on it...
}

andika("fibo(0) ni:", fibo(0))
andika("fibo(1) ni:", fibo(1))
', 'fanya fibo = unda(n) {
    kama (n == 0) {
        rudisha 0
    }
    kama (n == 1) {
        rudisha 1
    }
    rudisha n
}

andika("fibo(0) ni:", fibo(0))
andika("fibo(1) ni:", fibo(1))
', '[{"id": "fibo_base_output_0", "type": "match_output", "message": "The function must return 0 when n is 0 / Kazi (function) lazima irudishe 0 wakati n ikiwa 0", "pattern": "fibo\\(0\\)\\s+ni:\\s*0\\b", "isPublic": true}, {"id": "fibo_base_output_1", "type": "match_output", "message": "The function must return 1 when n is 1 / Kazi (function) lazima irudishe 1 wakati n ikiwa 1", "pattern": "fibo\\(1\\)\\s+ni:\\s*1\\b", "isPublic": true}, {"id": "fibo_base_kama", "type": "match_code", "message": "You must use `kama` (if) statements to define base cases / Lazima utumie taarifa za `kama` ili kufafanua kesi za kimsingi (base cases)", "pattern": "\\bkama\\b", "isPublic": true}, {"id": "fibo_base_rudisha", "type": "match_code", "message": "The base cases must return the correct values / Kesi za kimsingi lazima zirudishe thamani sahihi", "pattern": "\\brudisha\\s+[01n]\\b", "isPublic": true}]', 1, '2026-05-20 00:59:53.111198+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('e71a8378-aed6-41bd-a2a7-c086c385dcc4', 'e9217ef6-692e-4585-8b20-902bab3c433d', 'the-limit', '{"en": "5. The Speed Limit", "sw": "5. Kikomo cha Kasi"}', '{"en": "As `n` grows, the number of calls explodes! \n- `fibo(5)` = 15 calls\n- `fibo(10)` = 177 calls\n- `fibo(20)` = **Over 13,000 calls!**\n\nThis is why simple recursion can sometimes be \"expensive\" for a computer. It''s doing millions of calculations for the same small numbers (like `fibo(2)`) because it has no memory.\n\n**Your Task:** Change the input to 20 in both the `andika` message and the `fibo` call. Notice the slight delay as your computer works hard! We''ll fix this speed problem in the next lesson.\n\n```nuru\nandika(\"Calculating fibo(+++20+++)...\")\nandika(fibo(+++20+++))\n```", "sw": "Kadiri `n` inavyokuwa kubwa, idadi ya wito inalipuka!\n- `fibo(5)` = wito 15\n- `fibo(10)` = wito 177\n- `fibo(20)` = **Zaidi ya wito 13,000!**\n\nHii ndiyo sababu kujirudia rahisi wakati mwingine kunaweza kuwa \"ghali\" kwa kompyuta. Inafanya mamilioni ya hesabu kwa namba zile zile ndogo (kama `fibo(2)`) kwa sababu haina kumbukumbu.\n\n**Kazi Yako:** Badilisha ingizo kuwa 20 katika ujumbe wa `andika` na pia kwenye wito wa `fibo`. Angalia mkwamo kidogo wakati kompyuta yako inafanya kazi kwa bidii! Tutarekebisha tatizo hili la kasi katika somo lijalo.\n\n```nuru\nandika(\"Inakokotoa fibo(+++20+++)...\")\nandika(fibo(+++20+++))\n```"}', '{"en": "Change `fibo(5)` to `fibo(6)` and see how much slower it becomes. (Be patient, it might take a second!)", "sw": "Badilisha `fibo(5)` kuwa `fibo(20)` na uone jinsi inavyokuwa nzito. (Kuwa na subira, inaweza kuchukua sekunde chache!)"}', 'fanya fibo = unda(n) {
    kama (n <= 1) {
        rudisha n
    }
    rudisha fibo(n - 1) + fibo(n - 2)
}

// Jaribu namba kubwa zaidi (Try a bigger number)
andika("Calculating fibo(5)...")
andika(fibo(5))
', 'fanya fibo = unda(n) {
    kama (n <= 1) {
        rudisha n
    }
    rudisha fibo(n - 1) + fibo(n - 2)
}

andika("Calculating fibo(20)...")
andika(fibo(20))
', '[{"id": "fibo_limit_output_msg", "type": "match_output", "message": "The printed message must say ''Calculating fibo(20)...'' / Ujumbe uliochapishwa lazima useme ''Calculating fibo(20)...''", "pattern": "Calculating fibo\\(20\\)\\.\\.\\.", "isPublic": true}, {"id": "fibo_limit_output_val", "type": "match_output", "message": "The printed result must be 6765 / Tokeo lililochapishwa lazima liwe 6765", "pattern": "6765\\b", "isPublic": true}, {"id": "fibo_limit_code_call", "type": "match_code", "message": "You must call `fibo(20)` to test the limits of recursion / Lazima uite `fibo(20)` ili kujaribu mipaka ya urudiaji", "pattern": "fibo\\s*\\(\\s*20\\s*\\)", "isPublic": true}]', 4, '2026-05-20 00:59:53.372144+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('0e7eb9a3-c8f3-40d3-b3c1-74642bcdbe90', '4cf86550-82b2-4372-adad-348f00aa6cf4', 'divide', '{"en": "2. Divide and Conquer", "sw": "2. Kugawanya Tatizo"}', '{"en": "**Merge Sort** uses a strategy called **Divide and Conquer**.\n\nInstead of trying to sort a big list all at once, we split it into two smaller lists. It''s much easier to sort two small things than one big thing!\n\n### The Split:\nWe find the middle index and slice the array in half using a `kwa` loop.\n\n**Your Task:** Use a `kwa` loop to split the list in half.\n- If the index `i` is less than `katikati`, push the number to `kushoto`.\n- Otherwise, push it to `kulia`.\n\n```nuru\nfanya orodha = [1, 2, 3, 4, 5, 6]\nfanya katikati = orodha.idadi() / 2\n\nfanya kushoto = []\nfanya kulia = []\n\nkwa i, namba ktk orodha {\n    kama (i < katikati) {\n        +++kushoto.sukuma(namba)+++\n    } sivyo {\n        +++kulia.sukuma(namba)+++\n    }\n}\n\nandika(\"Kushoto:\", kushoto)\nandika(\"Kulia:\", kulia)\n```", "sw": "**Merge Sort** inatumia mkakati wa **kugawanya tatizo** katika sehemu ndogo.\n\nBadala ya kujaribu kupanga orodha kubwa yote kwa mara moja, tunaigawanya katika orodha mbili ndogo. Ni rahisi zaidi kupanga vitu viwili vidogo kuliko kitu kimoja kikubwa!\n\n### Mgawanyo:\nTunatafuta namba ya katikati na kuikata safu (array) nusu kwa kutumia kitanzi cha `kwa`.\n\n**Kazi Yako:** Tumia mzunguko wa `kwa` kugawanya orodha katikati.\n- Ikiwa fahirisi `i` ni chini ya `katikati`, sukuma namba kwenye `kushoto`.\n- Vinginevyo, isukume kwenye `kulia`.\n\n```nuru\nfanya orodha = [1, 2, 3, 4, 5, 6]\nfanya katikati = orodha.idadi() / 2\n\nfanya kushoto = []\nfanya kulia = []\n\nkwa i, namba ktk orodha {\n    kama (i < katikati) {\n        +++kushoto.sukuma(namba)+++\n    } sivyo {\n        +++kulia.sukuma(namba)+++\n    }\n}\n\nandika(\"Kushoto:\", kushoto)\nandika(\"Kulia:\", kulia)\n```"}', '{"en": "Use a `kwa` loop to split the `orodha` into two equal halves: `kushoto` (left) and `kulia` (right).", "sw": "Tumia kitanzi cha `kwa` kugawanya `orodha` katika sehemu mbili sawa: `kushoto` na `kulia`."}', 'fanya orodha = [1, 2, 3, 4, 5, 6]
fanya katikati = orodha.idadi() / 2

fanya kushoto = []
fanya kulia = []

kwa i, namba ktk orodha {
    kama (i < katikati) {
        
    } sivyo {
        
    }
}

andika("Kushoto:", kushoto)
andika("Kulia:", kulia)
', 'fanya orodha = [1, 2, 3, 4, 5, 6]
fanya katikati = orodha.idadi() / 2

fanya kushoto = []
fanya kulia = []

kwa i, namba ktk orodha {
    kama (i < katikati) {
        kushoto.sukuma(namba)
    } sivyo {
        kulia.sukuma(namba)
    }
}

andika("Kushoto:", kushoto)
andika("Kulia:", kulia)
', '[{"id": "sorting_divide_kushoto_output", "type": "match_output", "message": "The left half must contain the first three items. / Nusu ya kushoto lazima iwe na vitu vitatu vya kwanza.", "pattern": "Kushoto:\\s*\\[\\s*1,\\s*2,\\s*3\\s*\\]", "isPublic": true}, {"id": "sorting_divide_kulia_output", "type": "match_output", "message": "The right half must contain the last three items. / Nusu ya kulia lazima iwe na vitu vitatu vya mwisho.", "pattern": "Kulia:\\s*\\[\\s*4,\\s*5,\\s*6\\s*\\]", "isPublic": true}, {"id": "sorting_divide_kushoto_code", "type": "match_code", "message": "You must use the .sukuma() method to add items to the kushoto list inside the loop. / Lazima utumie mbinu ya .sukuma() kuongeza vitu kwenye orodha ya kushoto ndani ya kitanzi.", "pattern": "kushoto\\s*\\.\\s*sukuma\\s*\\(\\s*(namba|orodha\\s*\\[\\s*i\\s*\\])\\s*\\)", "isPublic": true}, {"id": "sorting_divide_kulia_code", "type": "match_code", "message": "You must use the .sukuma() method to add items to the kulia list inside the loop. / Lazima utumie mbinu ya .sukuma() kuongeza vitu kwenye orodha ya kulia ndani ya kitanzi.", "pattern": "kulia\\s*\\.\\s*sukuma\\s*\\(\\s*(namba|orodha\\s*\\[\\s*i\\s*\\])\\s*\\)", "isPublic": true}]', 1, '2026-05-20 00:59:53.801095+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('f5af18cd-5bb6-4e9e-b43c-0992a543e62a', '4cf86550-82b2-4372-adad-348f00aa6cf4', 'putting-it-together', '{"en": "5. Full Merge Sort", "sw": "5. Merge Sort Kamili"}', '{"en": "It''s time to put all the pieces together into one of the most famous algorithms in history!\n\n### The Full Cycle:\n1. **Base Case:** If list size $\\le 1$, return it.\n2. **Split:** Slice the list in half.\n3. **Recurse:** Call `panga` on the left half. Call `panga` on the right half.\n4. **Merge:** Use our `unganisha` function to combine the two now-sorted halves.\n\n**Your Task:** Fill in the recursive calls. You must call `panga` on `kata(orodha, 0, kati)` and `panga` on `kata(orodha, kati)`.\n\n```nuru\nfanya panga = unda(orodha) {\n    kama (orodha.idadi() <= 1) { rudisha orodha }\n    fanya kati = orodha.idadi() / 2\n    fanya kushoto = +++panga(kata(orodha, 0, kati))+++\n    fanya kulia = +++panga(kata(orodha, kati))+++\n    rudisha unganisha(kushoto, kulia)\n}\n\nandika(panga([38, 27, 43, 3, 9, 82, 10]))\n```\n\nWait, isn''t it amazing? The function sorts the halves by calling *itself*! This is the true power of recursion.", "sw": "Ni wakati wa kuweka vipande vyote pamoja katika moja ya algorithms maarufu zaidi katika historia!\n\n### Mzunguko Kamili:\n1. **Kesi ya Msingi:** Ikiwa ukubwa wa orodha $\\le 1$, irudishe.\n2. **Gawanya:** Kata orodha nusu.\n3. **Jirudie:** Ita `panga` kwenye nusu ya kushoto. Ita `panga` kwenye nusu ya kulia.\n4. **Unganisha:** Tumia kitendakazi chetu cha `unganisha` kuunganisha nusu hizo mbili ambazo sasa zimepangwa.\n\n**Kazi Yako:** Jaza wito wa kujirudia. Lazima uite `panga` kwa `kata(orodha, 0, kati)` na `panga` kwa `kata(orodha, kati)`.\n\n```nuru\nfanya panga = unda(orodha) {\n    kama (orodha.idadi() <= 1) { rudisha orodha }\n    fanya kati = orodha.idadi() / 2\n    fanya kushoto = +++panga(kata(orodha, 0, kati))+++\n    fanya kulia = +++panga(kata(orodha, kati))+++\n    rudisha unganisha(kushoto, kulia)\n}\n\nandika(panga([38, 27, 43, 3, 9, 82, 10]))\n```\n\nJe, si jambo la kushangaza? Kitendakazi kinapanga nusu kwa kujiita *chenyewe*! Huu ndio nguvu halisi ya kujirudia."}', '{"en": "Combine everything! Recursively call `panga` on both halves, then `unganisha` the results.", "sw": "Unganisha kila kitu! Ita `panga` kwa kujirudia kwenye nusu zote mbili, kisha `unganisha` matokeo."}', '// Kisaidizi cha kukata orodha (Helper to slice arrays)
fanya kata = unda(orodha, anza, mwisho = -1) {
    kama (mwisho == -1) { mwisho = orodha.idadi() }
    fanya mpya = []
    kwa i, t ktk orodha { kama (i >= anza && i < mwisho) { mpya.sukuma(t) } }
    rudisha mpya
}


fanya unganisha = unda(a, b) {
    fanya matokeo = []
    wakati (a.idadi() > 0 && b.idadi() > 0) {
        kama (a[0] < b[0]) {
            matokeo.sukuma(a[0])
            a = kata(a, 1)
        } sivyo {
            matokeo.sukuma(b[0])
            b = kata(b, 1)
        }
    }
    rudisha matokeo + a + b
}

fanya panga = unda(orodha) {
    kama (orodha.idadi() <= 1) { rudisha orodha }

    fanya kati = orodha.idadi() / 2
    
    fanya kushoto = 
    fanya kulia = 

    rudisha unganisha(kushoto, kulia)
}

andika(panga([38, 27, 43, 3, 9, 82, 10]))
', '// Kisaidizi cha kukata orodha (Helper to slice arrays)
fanya kata = unda(orodha, anza, mwisho = -1) {
    kama (mwisho == -1) { mwisho = orodha.idadi() }
    fanya mpya = []
    kwa i, t ktk orodha { kama (i >= anza && i < mwisho) { mpya.sukuma(t) } }
    rudisha mpya
}


fanya unganisha = unda(a, b) {
    fanya matokeo = []
    wakati (a.idadi() > 0 && b.idadi() > 0) {
        kama (a[0] < b[0]) {
            matokeo.sukuma(a[0])
            a = kata(a, 1)
        } sivyo {
            matokeo.sukuma(b[0])
            b = kata(b, 1)
        }
    }
    rudisha matokeo + a + b
}

fanya panga = unda(orodha) {
    kama (orodha.idadi() <= 1) { rudisha orodha }
    fanya kati = orodha.idadi() / 2
    fanya kushoto = panga(kata(orodha, 0, kati))
    fanya kulia = panga(kata(orodha, kati))
    rudisha unganisha(kushoto, kulia)
}

andika(panga([38, 27, 43, 3, 9, 82, 10]))
', '[{"id": "sorting_full_output", "type": "match_output", "message": "The output must show the fully sorted list: [3, 9, 10, 27, 38, 43, 82]. / Matokeo lazima yaonyeshe orodha iliyopangwa kikamilifu: [3, 9, 10, 27, 38, 43, 82].", "pattern": "\\[\\s*3,\\s*9,\\s*10,\\s*27,\\s*38,\\s*43,\\s*82\\s*\\]", "isPublic": true}, {"id": "sorting_full_code_kushoto", "type": "match_code", "message": "You must call panga recursively on the left half. / Lazima uite panga kwa kujirudia kwenye nusu ya kushoto.", "pattern": "panga\\s*\\(\\s*kata\\s*\\(\\s*orodha\\s*,\\s*0\\s*,\\s*kati\\s*\\)\\s*\\)", "isPublic": true}, {"id": "sorting_full_code_kulia", "type": "match_code", "message": "You must call panga recursively on the right half. / Lazima uite panga kwa kujirudia kwenye nusu ya kulia.", "pattern": "panga\\s*\\(\\s*kata\\s*\\(\\s*orodha\\s*,\\s*kati\\s*\\)\\s*\\)", "isPublic": true}]', 4, '2026-05-20 00:59:54.061312+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('17d1d5f8-6c59-4a56-a4d5-a6cae855ca44', 'f8d93c6d-184b-47c4-811a-ee1f310ddf31', 'solving', '{"en": "5. The Final Solver", "sw": "5. Suluhisho la Mwisho"}', '{"en": "You''ve reached the end of the course! \n\nBy combining **2D Arrays**, **Loops**, **Logic**, and **Recursion**, you''ve created an \"Intelligent\" program. \n\n### Why this is huge:\nThis same Backtracking algorithm is used to:\n- Solve puzzles like Chess.\n- Schedule flights for airlines.\n- Map out the most efficient delivery routes for trucks.\n\n### You are now a Programmer!\nYou started with `andika(\"Jambo\")` and you ended with an automated Sudoku solver. The world of technology is now yours to explore.\n\n**Your Task:** Run the final solver by calling the `tatua()` function. Look at how the empty zeros were replaced by the correct numbers. Congratulations on completing the Nuru Wasm Tutorial!\n\n```nuru\n// ...\n}\n\n+++tatua()+++\n\nandika(\"SUDOKU SOLVED!\")\n// ...\n```", "sw": "Umefika mwisho wa kozi hii!\n\nKwa kuunganisha **Safu za 2D**, **Vitanzi** (Loops), **Mantiki**, na **Kujirudia** (Recursion), umeunda programu \"Inayofikiri\".\n\n### Kwa nini hii ni kubwa:\nAlgorithm hii ya Backtracking inatumiwa pia:\n- Kutatua mafumbo kama Chess.\n- Kupanga safari za ndege kwa mashirika ya ndege.\n- Kupanga njia zenye ufanisi zaidi za utoaji bidhaa kwa malori.\n\n### Sasa wewe ni Mpangaji Programu!\nUlianza na `andika(\"Jambo\")` na umemaliza na suluhisho la Sudoku linalojiendesha lenyewe. Ulimwengu wa teknolojia sasa ni wako kuuchunguza.\n\n**Kazi Yako:** Endesha suluhisho la mwisho kwa kuita kitendakazi cha `tatua()`. Angalia jinsi sifuri zilivyobadilishwa na namba sahihi. Hongera sana kwa kukamilisha Mafunzo ya Nuru Wasm!\n\n```nuru\n// ...\n}\n\n+++tatua()+++\n\nandika(\"SUDOKU IMETATULIWA!\")\n// ...\n```"}', '{"en": "Run the full solver and watch it fill the grid! You''ve just built a program that can solve puzzles.", "sw": "Endesha suluhisho kamili na utazame likijaza gridi! Umetoka tu kujenga programu inayoweza kutatua mafumbo."}', 'fanya gridi = [
  [1, 0, 3, 0],
  [0, 0, 2, 1],
  [0, 1, 0, 2],
  [2, 4, 0, 3]
]

fanya ni_salama = unda(r, c, n) {
    kwa i ktk mfululizo(4) {
        kama (gridi[r][i] == n || gridi[i][c] == n) { rudisha sikweli }
    }
    rudisha kweli
}

fanya tatua = unda() {
    kwa r ktk mfululizo(4) {
        kwa c ktk mfululizo(4) {
            kama (gridi[r][c] == 0) {
                kwa n ktk mfululizo(1, 5) {
                    kama (ni_salama(r, c, n)) {
                        gridi[r][c] = n
                        kama (tatua()) { rudisha kweli }
                        gridi[r][c] = 0 // Backtrack
                    }
                }
                rudisha sikweli
            }
        }
    }
    rudisha kweli
}

// Wito (call) wa tatua unapaswa kuwa hapa

andika("SUDOKU SOLVED!")
kwa i ktk mfululizo(4) { andika(gridi[i]) }
', 'fanya gridi = [
  [1, 0, 3, 0],
  [0, 0, 2, 1],
  [0, 1, 0, 2],
  [2, 4, 0, 3]
]

fanya ni_salama = unda(r, c, n) {
    kwa i ktk mfululizo(4) {
        kama (gridi[r][i] == n || gridi[i][c] == n) { rudisha sikweli }
    }
    rudisha kweli
}

fanya tatua = unda() {
    kwa r ktk mfululizo(4) {
        kwa c ktk mfululizo(4) {
            kama (gridi[r][c] == 0) {
                kwa n ktk mfululizo(1, 5) {
                    kama (ni_salama(r, c, n)) {
                        gridi[r][c] = n
                        kama (tatua()) { rudisha kweli }
                        gridi[r][c] = 0 // Backtrack
                    }
                }
                rudisha sikweli
            }
        }
    }
    rudisha kweli
}

tatua()

andika("SUDOKU SOLVED!")
kwa i ktk mfululizo(4) { andika(gridi[i]) }
', '[{"id": "sudoku_solving_output", "type": "match_output", "flags": "i", "message": "Ensure you call tatua() and print the fully solved Sudoku grid / Hakikisha unaita tatua() na kuchapisha gridi ya Sudoku iliyotatuliwa kikamilifu", "pattern": "SUDOKU SOLVED!(\\s)*\\n*\\[1, 2, 3, 4\\]\\n*\\[3, 4, 2, 1\\]\\n*\\[4, 1, 3, 2\\]\\n*\\[2, 4, 1, 3\\]", "isPublic": true}, {"id": "sudoku_solving_code", "type": "match_code", "message": "Ensure you call the tatua() function / Hakikisha unaita kazi ya tatua()", "pattern": "\\btatua\\s*\\(\\s*\\)", "isPublic": true}]', 4, '2026-05-20 00:59:54.715072+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('bfabd37b-6940-4dc9-a9a2-11bbd615753a', 'f8d93c6d-184b-47c4-811a-ee1f310ddf31', 'intro', '{"en": "1. The Sudoku Challenge", "sw": "1. Changamoto ya Sudoku"}', '{"en": "Welcome to the final boss of our recursion journey: **The Sudoku Solver**.\n\nA Sudoku grid is a 2D array (a list of lists). The goal is to fill every `0` with a number from 1 to 4 (in a 4x4 grid) such that:\n1. No number repeats in a **Row**.\n2. No number repeats in a **Column**.\n3. No number repeats in a **Box**.\n\n**Your Task:** Look at the grid. We use `0` to represent empty cells. How would a computer even begin to solve this? We''ll use a technique called **Backtracking**.\n\n```nuru\nkwa i ktk mfululizo(gridi.idadi()) {\n    +++andika(gridi[i])+++\n}\n```", "sw": "Karibu kwenye changamoto ya mwisho ya safari yetu ya kujirudia: **Suluhisho la Sudoku**.\n\nGridi ya Sudoku ni safu ya 2D (orodha ya orodha). Lengo ni kujaza kila `0` kwa namba kuanzia 1 hadi 4 (katika gridi ya 4x4) ili:\n1. Hakuna namba inayojirudia katika **Mstari** (Row).\n2. Hakuna namba inayojirudia katika **Safu** (Column).\n3. Hakuna namba inayojirudia katika **Kikundi** (Box).\n\n**Kazi Yako:** Angalia gridi hiyo. Tunatumia `0` kuwakilisha visanduku vilivyo wazi. Kompyuta inaanzaje kutatua fumbo hili? Tutatumia mbinu inayoitwa **Backtracking**.\n\n```nuru\nkwa i ktk mfululizo(gridi.idadi()) {\n    +++andika(gridi[i])+++\n}\n```"}', '{"en": "Run the code to see a 4x4 Sudoku grid represented in a 2D array. What numbers are missing?", "sw": "Endesha kodi ili uone gridi ya Sudoku ya 4x4 iliyowakilishwa katika safu ya 2D (2D array). Ni namba gani zinakosekana?"}', 'fanya gridi = [
  [1, 0, 3, 0],
  [0, 0, 2, 1],
  [0, 1, 0, 2],
  [2, 4, 0, 3]
]

// A 0 means the cell is empty.
andika("Sudoku Gridi:")
kwa i ktk mfululizo(gridi.idadi()) {
    // andika gridi hapa
}
', 'fanya gridi = [
  [1, 0, 3, 0],
  [0, 0, 2, 1],
  [0, 1, 0, 2],
  [2, 4, 0, 3]
]

// A 0 means the cell is empty.
andika("Sudoku Gridi:")
kwa i ktk mfululizo(gridi.idadi()) {
    andika(gridi[i])
}
', '[{"id": "sudoku_intro_output", "type": "match_output", "flags": "i", "message": "Ensure the grid is printed row by row in the loop / Hakikisha gridi inachapishwa mstari kwa mstari kwenye kitanzi", "pattern": "Sudoku Gridi:(\\s)*\\n*\\[1, 0, 3, 0\\]\\n*\\[0, 0, 2, 1\\]\\n*\\[0, 1, 0, 2\\]\\n*\\[2, 4, 0, 3\\]", "isPublic": true}, {"id": "sudoku_intro_code", "type": "match_code", "message": "You must use a loop over gridi.idadi() to print each row / Lazima utumie kitanzi juu ya gridi.idadi() ili kuchapisha kila mstari", "pattern": "kwa\\s+\\w+\\s+ktk\\s+mfululizo\\(\\s*gridi\\.idadi\\(\\s*\\)\\s*\\)\\s*\\{\\s*andika\\(\\s*gridi\\s*\\[\\s*\\w+\\s*\\]\\s*\\)\\s*\\}", "isPublic": true}]', 0, '2026-05-20 00:59:54.347411+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('7217613b-adce-4747-b85d-aaf9a7914d35', '314a38c4-d435-4283-9b11-b854450558cb', 'karibu', '{"en": "1. Welcome to Nuru!", "sw": "1. Welcome to Nuru!"}', '{"en": "Nuru is a programming language designed specifically for Swahili speakers. It allows you to write code using words you already know instead of just English.\n\nOur goal is to break the language barrier in the tech world. In this tutorial, you will learn all the basics of programming step by step.\n\nA program is a series of commands you give to the computer. Let''s start by seeing how a program works!\n\n### Your first line:\n```nuru\n// Huu ni mwanzo wa safari yako!\nandika(+++\"Habari Nuru!\"+++)\n```", "sw": "Nuru is a programming language designed specifically for Swahili speakers. It allows you to write code using words you already know instead of just English.\n\nOur goal is to break the language barrier in the tech world. In this tutorial, you will learn all the basics of programming step by step.\n\nA program is a series of commands you give to the computer. Let''s start by seeing how a program works!\n\n### Your first line:\n```nuru\n// Huu ni mwanzo wa safari yako!\nandika(+++\"Habari Nuru!\"+++)\n```"}', '{"en": "Click the ''Run'' button (the white one with the play icon) to see the results of this program in the ''Output'' section.", "sw": "Click the ''Run'' button (the white one with the play icon) to see the results of this program in the ''Output'' section."}', '// Huu ni mwanzo wa safari yako!
andika()
', 'andika("Habari Nuru!")', '[{"id": "misingi_karibu_1", "type": "match_output", "flags": "i", "message": "You must output ''Habari Nuru!'' / Lazima utoe matokeo ya ''Habari Nuru!''", "pattern": "Habari Nuru!", "isPublic": true}]', 0, '2026-05-20 00:59:50.130652+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('f1fb9143-9293-4a9f-b3d0-7d9e6c585871', '314a38c4-d435-4283-9b11-b854450558cb', 'aina-za-data', '{"en": "5. Data Types and Math", "sw": "5. Aina za Data na Hisabati"}', '{"en": "In Nuru, there are different types of information:\n1. **Numbers (Integers)**: Whole numbers like `10`, `-5`.\n2. **Floats**: Decimal numbers like `3.14`, `0.5`.\n3. **Strings**: Text inside `\" \"`.\n4. **Booleans**: Values of `kweli` (true) or `sikweli` (false).\n\n### Math Operators:\n- `+` (Add), `-` (Subtract), `*` (Multiply), `/` (Divide), `%` (Modulo/Remainder).\n\n### Example:\n```nuru\nandika(+++12 * 12+++)\n```", "sw": "Katika Nuru, kuna aina mbalimbali za taarifa:\n1. **Namba (Integers)**: Namba nzima kama `10`, `-5`.\n2. **Desimali (Floats)**: Namba zenye nukta kama `3.14`, `0.5`.\n3. **Tungo (Strings)**: Maandishi yaliyo ndani ya `\" \"`.\n4. **Buliani (Booleans)**: Thamani za `kweli` au `sikweli`.\n\n### Alama za Hisabati:\n- `+` (Jumla), `-` (Kutoa), `*` (Kuzidisha), `/` (Kugawanya), `%` (Baki).\n\n### Mfano:\n```nuru\nandika(+++12 * 12+++)\n```"}', '{"en": "Write a program that multiplies 12 by 12 and displays it.", "sw": "Andika programu inayozidisha 12 kwa 12 na kuionyesha."}', 'andika()
', 'andika(12 * 12)', '[{"id": "misingi_aina_za_data_1", "type": "match_code", "message": "You must multiply 12 by 12 / Lazima uzidishe 12 kwa 12", "pattern": "12\\s*\\*\\s*12", "isPublic": true}, {"id": "misingi_aina_za_data_2", "type": "exact_output", "message": "The output must be 144 / Matokeo lazima yawe 144", "isPublic": true, "expectedOutput": "144\n"}]', 4, '2026-05-20 00:59:50.504443+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('bdcb5b74-8bfa-447b-b0b5-67acf6ec05d6', '314a38c4-d435-4283-9b11-b854450558cb', 'maoni', '{"en": "3. Comments", "sw": "3. Maoni (Comments)"}', '{"en": "Comments are lines of text that the Nuru interpreter ignores. They are used to provide explanations for humans reading your code.\n\n### Types of Comments:\n1. **Single line**: Use `//`. Everything after this symbol will be ignored.\n2. **Multi-line**: Use `/*` to start and `*/` to end.\n\n### Example:\n```nuru\n+++// Hii ni programu yangu+++\nandika(\"Maoni hayataonekana!\")\n```", "sw": "Maoni ni mistari ya maandishi ambayo mfasiri wa Nuru anairuka. Yanatumika kutoa maelezo kwa binadamu wanaosoma msimbo wako.\n\n### Aina za Maoni:\n1. **Mstari mmoja**: Tumia `//`. Kila kitu baada ya alama hii kitarukwa.\n2. **Mistari mingi**: Tumia `/*` kuanza na `*/` kumaliza.\n\n### Mfano:\n```nuru\n+++// Hii ni programu yangu+++\nandika(\"Maoni hayataonekana!\")\n```"}', '{"en": "Add a single-line comment above the following `andika()` command.", "sw": "Ongeza maoni ya mstari mmoja juu ya amri ya `andika()` inayofuata."}', '
andika("Maoni hayataonekana!")
', '// Hii ni programu yangu
andika("Maoni hayataonekana!")', '[{"id": "misingi_maoni_1", "type": "match_code", "message": "You must include a single-line comment starting with ''//'' / Lazima uweke maoni ya mstari mmoja yanayoanza na ''//''", "pattern": "//[^\\n]+", "isPublic": true}, {"id": "misingi_maoni_2", "type": "exact_output", "message": "The output should be ''Maoni hayataonekana!'' / Matokeo yanatakiwa kuwa ''Maoni hayataonekana!''", "isPublic": true, "expectedOutput": "Maoni hayataonekana!\n"}]', 2, '2026-05-20 00:59:50.324497+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('d83e5e09-51b4-4543-a401-4106aeb29b2d', '314a38c4-d435-4283-9b11-b854450558cb', 'wakati', '{"en": "11. While Loops (wakati)", "sw": "11. Vitanzi vya Wakati (While)"}', '{"en": "A `wakati` loop continues to repeat as long as a certain condition is true.\n\n**Warning**: Make sure that condition will eventually become false, otherwise the program will loop forever!\n\n### Task:\n```nuru\nn = 5\n+++wakati (n > 0)+++ {\n    andika(n)\n    +++n = n - 1+++\n}\n```", "sw": "Kitanzi cha `wakati` kinaendelea kurudia mradi tu hali fulani iwe kweli.\n\n**Onyo**: Hakikisha hali hiyo itakuja kuwa sikweli wakati fulani, vinginevyo programu itajirudia milele!\n\n### Zoezi:\n```nuru\nn = 5\n+++wakati (n > 0)+++ {\n    andika(n)\n    +++n = n - 1+++\n}\n```"}', '{"en": "Write a `wakati` loop that starts with `n = 5` and decreases down to `1` (n = n - 1).", "sw": "Andika kitanzi cha `wakati` kinachoanza na `n = 5` na kupungua mpaka `1` (n = n - 1)."}', 'n = 5
 {
    andika(n)
    
}
', 'n = 5
wakati (n > 0) {
    andika(n)
    n = n - 1
}', '[{"id": "misingi_wakati_1", "type": "match_code", "message": "You must use a ''wakati'' loop / Lazima utumie mzunguko wa ''wakati''", "pattern": "wakati\\s*\\(", "isPublic": true}]', 10, '2026-05-20 00:59:51.029482+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('7a74cd37-3689-490d-b317-d891aea99d7e', '314a38c4-d435-4283-9b11-b854450558cb', 'kwa', '{"en": "10. Kwa Loops", "sw": "10. Vitanzi vya Kwa (Loops)"}', '{"en": "Loops are used to repeat an action many times. The word `kwa` helps us iterate through everything in an array or string.\n\n### Task:\n```nuru\n+++kwa i ktk mfululizo(5)+++ {\n    andika(+++i+++)\n}\n```", "sw": "Vitanzi vinatumiwa kurudia jambo mara nyingi. Neno `kwa` linatusaidia kupita kwenye kila kitu katika safu au tungo.\n\n### Zoezi:\n```nuru\n+++kwa i ktk mfululizo(5)+++ {\n    andika(+++i+++)\n}\n```"}', '{"en": "Write a loop that prints numbers from 0 to 4 using `mfululizo(5)`.", "sw": "Andika kitanzi kinachochapisha namba kutoka 0 mpaka 4 ukitumia `mfululizo(5)`."}', '{
    andika()
}
', 'kwa i ktk mfululizo(5) {
    andika(i)
}', '[{"id": "misingi_kwa_1", "type": "match_code", "message": "You must use a ''kwa'' loop / Lazima utumie mzunguko wa ''kwa''", "pattern": "kwa\\s*\\(", "isPublic": true}]', 9, '2026-05-20 00:59:50.942528+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('6fea5e68-49e5-4f30-a4ac-ebe5d8bcfdd1', '314a38c4-d435-4283-9b11-b854450558cb', 'badili-aina', '{"en": "12. Type Conversion", "sw": "12. Kubadili Aina ya Data"}', '{"en": "As you remember, `jaza()` returns text. If you want to do math with that input, you must convert it to a number.\n\n### Conversion Helpers:\n- `namba(thing)`: Converts to an integer.\n- `tungo(thing)`: Converts to a string.\n\n### Task:\n```nuru\nn = jaza(\"10\")\nandika(+++namba(n)+++ + 10)\n```", "sw": "Kama unakumbuka, `jaza()` inatoa maandishi. Kama unataka kufanya hesabu na ingizo hilo, lazima ulibadilishe kuwa namba.\n\n### Visaidia-kazi vya Kubadili:\n- `namba(kitu)`: Hugeuza kuwa namba nzima.\n- `tungo(kitu)`: Hugeuza kuwa maandishi.\n\n### Zoezi:\n```nuru\nn = jaza(\"10\")\nandika(+++namba(n)+++ + 10)\n```"}', '{"en": "Take a number from the user, add 10 to it, and display the result.", "sw": "Chukua namba kutoka kwa mtumiaji, iongezee 10 na uonyeshe tokeo."}', 'n = jaza("10")
andika( + 10)
', 'n = jaza("10")
andika(namba(n) + 10)', '[{"id": "misingi_badili_aina_1", "type": "match_code", "message": "You must use a type conversion function / Lazima utumie kitendakazi cha kubadili aina", "pattern": "namba\\(|tungo\\(|desimali\\(", "isPublic": true}]', 11, '2026-05-20 00:59:51.116476+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('9260c56e-137a-4175-a4ef-8c660edb1b73', '314a38c4-d435-4283-9b11-b854450558cb', 'safu', '{"en": "9. Lists (Arrays)", "sw": "9. Orodha (Safu)"}', '{"en": "An array is a collection of many things in a single box. These things are placed inside square brackets `[ ]`.\n\n### Key Facts:\n- The first position is **0**.\n- The second position is **1**, and so on.\n- `idadi()` gives you the number of items.\n- `sukuma(item)` adds an item to the end.\n\n### Task:\n```nuru\nrangi = +++[\"nyekundu\", \"kijani\"]+++\nrangi.+++sukuma(\"bluu\")+++\nandika(rangi.+++idadi()+++)\n```", "sw": "Safu ni mkusanyiko wa vitu vingi katika sanduku moja. Vitu hivi huwekwa ndani ya mabano mraba `[ ]`.\n\n### Mambo ya Muhimu:\n- Nafasi ya kwanza ni **0**.\n- Nafasi ya pili ni **1**, na kuendelea.\n- `idadi()` inakupa idadi ya vitu.\n- `sukuma(kitu)` inaongeza kitu mwishoni.\n\n### Zoezi:\n```nuru\nrangi = +++[\"nyekundu\", \"kijani\"]+++\nrangi.+++sukuma(\"bluu\")+++\nandika(rangi.+++idadi()+++)\n```"}', '{"en": "Create an array of `colors` with \"red\" and \"green\", add \"blue\" using `sukuma`, then print the number of colors.", "sw": "Tengeneza safu ya `rangi` yenye \"nyekundu\" na \"kijani\", ongeza \"bluu\" ukitumia `sukuma`, kisha andika idadi ya rangi."}', 'rangi = 
rangi.
andika(rangi.)
', 'rangi = ["nyekundu", "kijani"]
rangi.sukuma("bluu")
andika(rangi.idadi())', '[{"id": "misingi_safu_1", "type": "match_code", "message": "You must define an array / Lazima utengeneze safu", "pattern": "\\[.*\\]", "isPublic": true}]', 8, '2026-05-20 00:59:50.856705+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('3c41ffb0-d705-4f9f-9e31-f52c3aa6a46f', '451c3616-5844-422e-af37-3cd4fa4c57ff', 'arguments', '{"en": "2. Passing Arguments", "sw": "2. Kupitisha Hoja (Arguments)"}', '{"en": "A machine isn''t very useful if it does the exact same thing every time. \n\n**Arguments** let you pass information *into* a function. Think of arguments as the raw materials you feed into your machine.\n\n### Example:\n```s\nfanya jumlisha = unda(+++a, b+++) {\n    andika(a + b)\n}\n\njumlisha(5, 10) // Prints 15\njumlisha(100, 1) // Prints 101\n```\n\nWhen we create `unda(jina)`, `jina` acts as a placeholder variable. When we call `karibu(\"Amani\")`, the computer replaces `jina` with `\"Amani\"` inside the function.\n\n**Your Task:** Finish the `karibu` function so it can welcome anyone by their name!\n\n```nuru\nfanya karibu = unda(jina) {\n    andika(\"Karibu,\", +++jina+++)\n}\n```", "sw": "Mashine si muhimu sana ikiwa inafanya kitu kile kile kila wakati kila inapowashwa.\n\n**Hoja** (Arguments) zinakuruhusu kupitisha taarifa *ndani* ya kitendakazi. Fikiria hoja kama malighafi unayolisha kwenye mashine yako.\n\n### Mfano:\n```s\nfanya jumlisha = unda(+++a, b+++) {\n    andika(a + b)\n}\n\njumlisha(5, 10) // Inaandika 15\njumlisha(100, 1) // Inaandika 101\n```\n\nTunapotengeneza `unda(jina)`, `jina` inakuwa kishikilia-nafasi. Tunapoita `karibu(\"Amani\")`, kompyuta inabadilisha `jina` na kuweka `\"Amani\"` ndani ya kitendakazi.\n\n**Kazi Yako:** Malizia kitendakazi cha `karibu` ili kiweze kumkaribisha mtu yeyote kwa jina lake!\n\n```s\nfanya karibu = unda(jina) {\n    andika(\"Karibu,\", +++jina+++)\n}\n```"}', '{"en": "Complete the `karibu` function so it greets a person using the `jina` argument.", "sw": "Kamilisha kitendakazi `karibu` ili kimsalimie mtu kwa kutumia hoja ya `jina`."}', 'fanya karibu = unda(jina) {
    andika("Karibu,", /* weka jina hapa (put jina here) */)
}

karibu("Amani") // Should print: Karibu, Amani
karibu("Tariq") // Should print: Karibu, Tariq
', 'fanya karibu = unda(jina) {
    andika("Karibu,", jina)
}

karibu("Amani")
karibu("Tariq")
', '[{"id": "vitendakazi_arguments_1", "type": "match_code", "message": "The function ''karibu'' must accept ''jina'' as an argument. / Kitendakazi ''karibu'' lazima kichukue hoja ''jina''.", "pattern": "\\bfanya\\s+karibu\\s*=\\s*unda\\s*\\(\\s*jina\\s*\\)", "isPublic": true}, {"id": "vitendakazi_arguments_2", "type": "match_output", "message": "The output must contain ''Karibu, Amani''. / Matokeo lazima yawe na ''Karibu, Amani''.", "pattern": "Karibu,\\s+Amani", "isPublic": true}, {"id": "vitendakazi_arguments_3", "type": "match_output", "message": "The output must contain ''Karibu, Tariq''. / Matokeo lazima yawe na ''Karibu, Tariq''.", "pattern": "Karibu,\\s+Tariq", "isPublic": true}]', 1, '2026-05-20 00:59:51.461527+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('9f1d9af2-954a-4971-89fb-9ad19fb3fce3', '451c3616-5844-422e-af37-3cd4fa4c57ff', 'return-vs-print', '{"en": "3. Return vs Print", "sw": "3. Rudisha dhidi ya Andika"}', '{"en": "A common mistake for beginners is confusing printing (`andika`) with returning (`rudisha`).\n\n- **`andika`** is for **Humans**. It shows something on the screen so you can read it. The computer doesn''t \"remember\" what was printed.\n- **`rudisha`** is for the **Program**. It gives the result back so you can save it in a variable or use it in another calculation.\n\n### Look at the difference:\n```s\nfanya kwa_binadamu = unda() {\n    andika(10)\n}\n\nfanya kwa_programu = unda() {\n    +++rudisha 10+++\n}\n\nfanya x = kwa_binadamu() // x is now ''tupu'' (empty) because nothing was returned!\nfanya y = kwa_programu() // y is now 10!\n```\n\n**Your Task:** Fix the `zidisha` function so that it returns the value instead of just printing it. This allows the `jibu` variable to actually hold the result.\n\n```s\nfanya zidisha = unda(a, b) {\n    +++rudisha a * b+++\n}\n```", "sw": "Kosa la kawaida kwa wanaoanza ni kuchanganya kuandika (`andika`) na kurudisha (`rudisha`).\n\n- **`andika`** ni kwa ajili ya **Binadamu**. Inaonyesha kitu kwenye skrini ili uweze kusoma. Kompyuta \"hasahau\" kile kilichoandikwa mara tu baada ya kuonyesha.\n- **`rudisha`** ni kwa ajili ya **Programu**. Inarudisha matokeo ili uweze kuyahifadhi kwenye kibadilika au kuyatumia kwenye hesabu nyingine.\n\n### Angalia tofauti:\n```s\nfanya kwa_binadamu = unda() {\n    andika(10)\n}\n\nfanya kwa_programu = unda() {\n    +++rudisha 10+++\n}\n\nfanya x = kwa_binadamu() // x sasa ni ''tupu'' kwa sababu hakuna kilichorudishwa!\nfanya y = kwa_programu() // y sasa ni 10!\n```\n\n**Kazi Yako:** Rekebisha kitendakazi cha `zidisha` ili kirudishe thamani badala ya kuiandika tu. Hii itaruhusu kibadilika `jibu` kishike matokeo ya kweli.\n\n```s\nfanya zidisha = unda(a, b) {\n    +++rudisha a * b+++\n}\n```"}', '{"en": "Change `andika` to `rudisha` inside the `zidisha` function so the variable `jibu` can store the result.", "sw": "Badilisha `andika` kuwa `rudisha` ndani ya kitendakazi `zidisha` ili kibadilika (variable) `jibu` kiweze kuhifadhi matokeo."}', 'fanya zidisha = unda(a, b) {
    // Fix this line!
    andika(a * b)
}

fanya jibu = zidisha(3, 4)
andika("Jibu ni:", jibu) // Oh no! Jibu is empty (tupu)!
', 'fanya zidisha = unda(a, b) {
    rudisha a * b
}

fanya jibu = zidisha(3, 4)
andika("Jibu ni:", jibu)
', '[{"id": "vitendakazi_return_vs_print_1", "type": "match_code", "message": "The ''zidisha'' function must return the result using the ''rudisha'' keyword. / Kitendakazi ''zidisha'' lazima kirudishe matokeo kwa kutumia neno ''rudisha''.", "pattern": "\\bfanya\\s+zidisha\\s*=\\s*unda\\s*\\(\\s*a\\s*,\\s*b\\s*\\)\\s*\\{[^}]*\\brudisha\\s+a\\s*\\*\\s*b\\b", "isPublic": true}, {"id": "vitendakazi_return_vs_print_2", "type": "match_output", "message": "The output must be exactly ''Jibu ni: 12'' and the multiplication result must not be printed inside the function. / Matokeo lazima yawe ''Jibu ni: 12'' na zidisho lisichapishwe ndani ya kitendakazi.", "pattern": "^Jibu ni:\\s*12\\s*$", "isPublic": true}]', 2, '2026-05-20 00:59:51.548222+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('00a067d1-229b-43d6-928d-b7f71bc7d0d3', '451c3616-5844-422e-af37-3cd4fa4c57ff', 'higher-order', '{"en": "7. Higher-Order Functions", "sw": "7. Vitendakazi vya Ngazi ya Juu"}', '{"en": "Wait... you can pass a function *into* another function?! Yes! \n\nIn Nuru, functions are **First-Class Citizens**. This means you can treat them like any other value (like numbers or strings). You can store them in variables and pass them as arguments.\n\nA function that takes another function as an argument is called a **Higher-Order Function**.\n\n### Example:\n```s\nfanya piga_kelele = unda() {\n    andika(\"AAAH!\")\n}\n\nfanya endesha = unda(f) {\n    f() // Execute the passed function\n}\n\n+++endesha(piga_kelele)+++ // AAAH!\n```\n\n**Your Task:** Pass the `kicheko` function into `fanya_mara_mbili` so that the laughter is repeated twice! Notice you do NOT use `()` when passing the function name.\n\n```s\nfanya kicheko = unda() {\n    andika(\"Hahaha!\")\n}\n\nfanya fanya_mara_mbili = unda(kazi) {\n    kazi()\n    kazi()\n}\n\n+++fanya_mara_mbili(kicheko)+++\n```", "sw": "Ngoja... unaweza kupitisha kitendakazi *ndani* ya kitendakazi kingine?! Ndiyo!\n\nKatika Nuru, vitendakazi vinachukuliwa kama thamani nyingine yoyote (kama namba au maneno). Unaweza kuvihifadhi kwenye vibadilika na kuvipitisha kama hoja (arguments) kwenye vitendakazi vingine.\n\nKitendakazi kinachopokea kitendakazi kingine kama hoja kinaitwa **Kitendakazi cha Ngazi ya Juu** (Higher-Order Function).\n\n### Mfano:\n```s\nfanya piga_kelele = unda() {\n    andika(\"AAAH!\")\n}\n\nfanya endesha = unda(f) {\n    f() // Tekeleza kitendakazi kilichopitishwa\n}\n\n+++endesha(piga_kelele)+++ // AAAH!\n```\n\n**Kazi Yako:** Pitisha kitendakazi `kicheko` ndani ya `fanya_mara_mbili` ili kicheko hicho kirudiwe mara mbili! Kumbuka, HUTUMII `()` unapotaja jina la kitendakazi unachopitisha.\n\n```s\nfanya kicheko = unda() {\n    andika(\"Hahaha!\")\n}\n\nfanya fanya_mara_mbili = unda(kazi) {\n    kazi()\n    kazi()\n}\n\n+++fanya_mara_mbili(kicheko)+++\n```"}', '{"en": "Pass the `kicheko` function as an argument into `fanya_mara_mbili`.", "sw": "Pitisha kitendakazi `kicheko` kama hoja ndani ya `fanya_mara_mbili`."}', 'fanya kicheko = unda() {
    andika("Hahaha!")
}

// This function expects another function as ''kazi''
fanya fanya_mara_mbili = unda(kazi) {
    kazi()
    kazi()
}

// Piga fanya_mara_mbili ukipitisha kicheko!
fanya_mara_mbili( /* nini? */ )
', 'fanya kicheko = unda() {
    andika("Hahaha!")
}

fanya fanya_mara_mbili = unda(kazi) {
    kazi()
    kazi()
}

fanya_mara_mbili(kicheko)
', '[{"id": "vitendakazi_higher_order_1", "type": "match_code", "message": "The higher-order function must accept another function as a parameter. / Kitendakazi cha ngazi ya juu lazima kichukue kitendakazi kingine kama parameter.", "pattern": "\\bunda\\s*\\(\\s*[a-zA-Z_][a-zA-Z0-9_]*\\s*,\\s*[a-zA-Z_][a-zA-Z0-9_]*\\s*\\)", "isPublic": true}]', 6, '2026-05-20 00:59:51.903667+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('89a0d741-87d1-498c-a90f-eacb67f40922', '451c3616-5844-422e-af37-3cd4fa4c57ff', 'scope', '{"en": "4. Variable Scope", "sw": "4. Wigo wa Vibadilika (Scope)"}', '{"en": "**Scope** is the area where a variable is allowed to exist.\n\n- **Global Scope:** Variables created outside of any function. Everyone can see and change them. This can lead to bugs!\n- **Local Scope:** Variables created *inside* a function. They are locked inside! Outside code cannot see them.\n\n### Example:\n```s\nfanya jina = \"Amani\" // Global\n\nfanya siri = unda() {\n    +++fanya password = \"123\"+++ // Local\n    andika(password) // This works!\n}\n\nandika(jina) // Works\nandika(password) // ERROR! The computer doesn''t know what ''password'' is out here.\n```\n\nLocal variables are safer because they don''t clutter up your program. \n\n**Your Task:** Move the `siri` variable inside the `ficha` function to make it local.\n\n```s\nfanya ficha = unda() {\n    +++fanya siri = \"Nywila\"+++\n    andika(siri)\n}\n```", "sw": "**Wigo** (Scope) ni eneo ambalo kibadilika kinaruhusiwa kuwepo.\n\n- **Wigo wa Nje (Global):** Vibadilika vilivyotengenezwa nje ya kitendakazi chochote. Kila mtu anaweza kuviona na kuvibadilisha. Hii inaweza kusababisha makosa!\n- **Wigo wa Ndani (Local):** Vibadilika vilivyotengenezwa *ndani* ya kitendakazi. Vimefungiwa ndani! Kodi ya nje haiwezi kuviona wala kuvitumia.\n\n### Mfano:\n```s\nfanya jina = \"Amani\" // Global\n\nfanya ficha_nywila = unda() {\n    +++fanya siri = \"123\"+++ // Local\n    andika(siri) // Inafanya kazi!\n}\n\nandika(jina) // Inafanya kazi\nandika(siri) // KOSA! Kompyuta haijui ''siri'' ni nini huku nje.\n```\n\nVibadilika vya ndani ni salama zaidi kwa sababu havivurugi sehemu nyingine za programu yako.\n\n**Kazi Yako:** Sogeza kibadilika `siri` ndani ya kitendakazi `ficha` ili kukifanya kiwe cha ndani.\n\n```s\nfanya ficha = unda() {\n    +++fanya siri = \"Nywila\"+++\n    andika(siri)\n}\n```"}', '{"en": "Move `fanya siri = ''Nywila''` inside the `ficha` function so it becomes a ''Local'' variable.", "sw": "Sogeza `fanya siri = ''Nywila''` ndani ya kitendakazi `ficha` ili iwe kibadilika cha ''Ndani'' (Local variable)."}', 'fanya siri = "Nywila"

fanya ficha = unda() {
    // Sogeza siri hapa ndani (Move siri in here)
    andika(siri)
}

ficha()

// This should crash kama siri is hidden inside! Try it after fixing.
// andika("Nje ya function:", siri) 
', 'fanya ficha = unda() {
    fanya siri = "Nywila"
    andika(siri)
}

ficha()
', '[{"id": "vitendakazi_scope_1", "type": "match_code", "message": "The ''siri'' variable must be defined locally inside the ''ficha'' function. / Variable ''siri'' lazima iundwe ndani ya kitendakazi cha ''ficha''.", "pattern": "\\bfanya\\s+ficha\\s*=\\s*unda\\s*\\(\\s*\\)\\s*\\{[^}]*\\bfanya\\s+siri\\s*=\\s*[\"'']Nywila[\"'']", "isPublic": true}, {"id": "vitendakazi_scope_2", "type": "match_output", "message": "The output should be ''Nywila''. / Matokeo yanapaswa kuwa ''Nywila''.", "pattern": "^Nywila\\s*$", "isPublic": true}]', 3, '2026-05-20 00:59:51.633683+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('606635f4-c4f4-4d7c-a78d-039a62328c49', '451c3616-5844-422e-af37-3cd4fa4c57ff', 'nested-calls', '{"en": "5. Calling Functions from Functions", "sw": "5. Kuita Kitendakazi kutoka Ndani"}', '{"en": "In programming, functions often rely on other functions to get their jobs done. \n\nIf you have a complex problem, you don''t need to write one massive function. Instead, you can create many small, simple functions that call each other! This makes your code much easier to read and fix.\n\n### Example:\n```s\nfanya pata_namba = unda() {\n    rudisha 10\n}\n\nfanya hesabu = unda() {\n    +++fanya n = pata_namba()+++\n    andika(n + 1) // 11\n}\n\nhesabu()\n```\n\n**Your Task:** Inside the `salimia` function, call `tafuta_jina()` and store the result in the `jina` variable. Then use that variable in the greeting!\n\n```s\nfanya tafuta_jina = unda() {\n    rudisha \"Amani\"\n}\n\nfanya salimia = unda() {\n    +++fanya jina = tafuta_jina()+++\n    andika(\"Habari\", jina)\n}\n\nsalimia()\n```", "sw": "Kwenye upangaji programu (programming), vitendakazi mara nyingi vinategemea vitendakazi vingine ili kufanya kazi zao.\n\nIkiwa una tatizo gumu, huhitaji kuandika kitendakazi kimoja kikubwa na kirefu. Badala yake, unaweza kutengeneza vitendakazi vingi vidogo na rahisi vinavyoitana! Hii inafanya kodi yako kuwa rahisi kusoma na kurekebisha.\n\n### Mfano:\n```s\nfanya pata_namba = unda() {\n    rudisha 10\n}\n\nfanya hesabu = unda() {\n    +++fanya n = pata_namba()+++\n    andika(n + 1) // 11\n}\n\nhesabu()\n```\n\n**Kazi Yako:** Ndani ya kitendakazi `salimia`, ita `tafuta_jina()` na uhifadhi matokeo kwenye kibadilika `jina`. Kisha tumia kibadilika hicho kwenye salamu!\n\n```s\nfanya tafuta_jina = unda() {\n    rudisha \"Amani\"\n}\n\nfanya salimia = unda() {\n    +++fanya jina = tafuta_jina()+++\n    andika(\"Habari\", jina)\n}\n\nsalimia()\n```"}', '{"en": "Complete the `salimia` function to call the `tafuta_jina` function to get the name to print.", "sw": "Kamilisha kitendakazi `salimia` kwa kuita kitendakazi `tafuta_jina` ili kupata jina la kuandika."}', 'fanya tafuta_jina = unda() {
    rudisha "Amani"
}

fanya salimia = unda() {
    // 1. Get the name
    fanya jina = // piga tafuta_jina() hapa (call tafuta_jina() here)
    
    // 2. Print the greeting
    andika("Habari", jina)
}

salimia()
', 'fanya tafuta_jina = unda() {
    rudisha "Amani"
}

fanya salimia = unda() {
    fanya jina = tafuta_jina()
    andika("Habari", jina)
}

salimia()
', '[{"id": "vitendakazi_nested_calls_1", "type": "match_code", "message": "The ''salimia'' function must call ''tafuta_jina()'' to assign the name. / Kitendakazi ''salimia'' lazima kiite ''tafuta_jina()'' ili kupata jina.", "pattern": "\\bfanya\\s+salimia\\s*=\\s*unda\\s*\\(\\s*\\)\\s*\\{[^}]*\\bfanya\\s+jina\\s*=\\s*tafuta_jina\\s*\\(\\s*\\)", "isPublic": true}, {"id": "vitendakazi_nested_calls_2", "type": "match_output", "message": "The output must be ''Habari Amani''. / Matokeo lazima yawe ''Habari Amani''.", "pattern": "^Habari\\s+Amani\\s*$", "isPublic": true}]', 4, '2026-05-20 00:59:51.720328+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('7b8bfae1-8ebf-4f78-8d11-80cbb5531d9e', '30a05a13-4345-4304-890c-654e330f7949', 'base-case', '{"en": "2. The Base Case", "sw": "2. Sharti la Kusimama (Base Case)"}', '{"en": "To stop a recursive function from crashing, we must give it a stopping condition. We call this the **Base Case**.\n\nThe Base Case is simply an `if` (`kama`) statement that says: \"If we have reached our goal, STOP and `rudisha` (return) immediately.\"\n\n### How it looks:\n```s\nfanya stop_at_zero = unda(n) {\n    kama (n == 0) {\n        rudisha // STOP HERE\n    }\n    // ... rest of code\n}\n```\n\nWithout a Base Case, recursion is just a destructive infinite loop.\n\n**Your Task:** Add the Base Case and call the function with `5` to test it.\n\n```nuru\nfanya hesabu = unda(n) {\n    +++kama (n <= 0) {\n        andika(\"Imekamilika!\")\n        rudisha tupu\n    }+++\n\n    andika(n)\n    hesabu(n)\n}\n\n+++hesabu(5)+++\n```", "sw": "Ili kuzuia kitendakazi kinachojirudia kisisababishe kosa, lazima tukiishe sharti la kusimama. Tunaita hii **Sharti la Kusimama** (Base Case).\n\nSharti la Kusimama ni kauli rahisi ya `kama` inayosema: \"Ikiwa tumefikia lengo letu, SIMAMA na `rudisha` (return) mara moja.\"\n\n### Inavyoonekana:\n```s\nfanya simama_kwenye_sifuri = unda(n) {\n    kama (n == 0) {\n        rudisha // SIMAMA HAPA\n    }\n    // ... kodi nyingine\n}\n```\n\nBila Sharti la Kusimama, kujirudia ni kitanzi kisicho na mwisho chenye madhara.\n\n**Kazi Yako:** Ongeza Sharti la Kusimama na uite kitendakazi ukitumia `5` ili kukijaribu.\n\n```nuru\nfanya hesabu = unda(n) {\n    +++kama (n <= 0) {\n        andika(\"Imekamilika!\")\n        rudisha tupu\n    }+++\n\n    andika(n)\n    hesabu(n)\n}\n\n+++hesabu(5)+++\n```"}', '{"en": "Add a `kama` (if) statement to check if `n <= 0`. If it is, `rudisha tupu` to stop the recursion.", "sw": "Ongeza kauli ya `kama` (if) ili kuangalia ikiwa `n <= 0`. Ikiwa ni hivyo, `rudisha tupu` ili kusitisha mchakato wa kujirudia."}', 'fanya hesabu = unda(n) {
    andika(n)
    hesabu(n)
}
', 'fanya hesabu = unda(n) {
    kama (n <= 0) {
        andika("Imekamilika!")
        rudisha tupu
    }

    andika(n)
    hesabu(n)
}

hesabu(5)
', '[{"id": "kujirudia_base_case_func_def", "type": "match_code", "message": "The function ''hesabu'' must be defined with parameter ''n''. / Kitendakazi ''hesabu'' lazima kifafanuliwe kikiwa na kigezo ''n''.", "pattern": "fanya\\s+hesabu\\s*=\\s*unda\\s*\\(\\s*n\\s*\\)", "isPublic": true}, {"id": "kujirudia_base_case_cond", "type": "match_code", "message": "You must add a base case using ''kama'' to check if n <= 0. / Lazima uongeze sharti la kusimama ukitumia ''kama'' ili kuangalia ikiwa n <= 0.", "pattern": "kama\\s*\\(\\s*n\\s*(?:<=\\s*0|==\\s*0|<\\s*1)\\s*\\)", "isPublic": true}, {"id": "kujirudia_base_case_return", "type": "match_code", "message": "The base case must return to stop the recursion. / Sharti la kusimama lazima lirudishe matokeo ili kusitisha mchakato wa kujirudia.", "pattern": "kama\\s*\\(\\s*n\\s*(?:<=\\s*0|==\\s*0|<\\s*1)\\s*\\)\\s*\\{[^}]*\\brudisha\\b", "isPublic": true}, {"id": "kujirudia_base_case_print", "type": "match_code", "message": "Make sure to write ''Imekamilika!'' when the base case is reached. / Hakikisha unaandika ''Imekamilika!'' sharti la kusimama linapofikiwa.", "pattern": "andika\\(\\s*[\"'']Imekamilika![\"'']\\s*\\)", "isPublic": true}, {"id": "kujirudia_base_case_call", "type": "match_code", "message": "Make sure to call ''hesabu(5)'' to test your function. / Hakikisha unaita ''hesabu(5)'' ili kujaribu kitendakazi chako.", "pattern": "\\bhesabu\\s*\\(\\s*5\\s*\\)", "isPublic": true}]', 1, '2026-05-20 00:59:52.332869+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('15850606-a45c-4e39-9475-f84c9143d789', '30a05a13-4345-4304-890c-654e330f7949', 'recursive-step', '{"en": "3. The Recursive Step", "sw": "3. Hatua ya Kujirudia (Recursive Step)"}', '{"en": "We have a Base Case that stops when `n <= 0`. But if we start with `n = 3` and keep passing `3` into the function, it will never reach `0`!\n\nWe need a **Recursive Step**. This means every time the function calls itself, it must change its argument to get a little bit closer to the Base Case.\n\n### Why subtraction?\nIn this example, we are counting down. So, each step must be smaller than the last.\n- Step 1: `hesabu(3)`\n- Step 2: `hesabu(2)`\n- Step 3: `hesabu(1)`\n- Step 4: `hesabu(0)` -> **STOP!**\n\n**Your Task:** Complete the Recursive Step by passing `n - 1` to the function call.\n\n```nuru\nfanya hesabu = unda(n) {\n    kama (n <= 0) {\n        andika(\"Imekamilika!\")\n        rudisha tupu\n    }\n\n    andika(n)\n    hesabu(+++n - 1+++)\n}\n\nhesabu(3)\n```", "sw": "Tunalo Sharti la Kusimama ambalo linasimama wakati `n <= 0`. Lakini ikiwa tutaanza na `n = 3` na kuendelea kupitisha `3` kwenye kitendakazi, hakitawahi kufika `0`!\n\nTunahitaji **Hatua ya Kujirudia**. Hii ina maana kila wakati kitendakazi kinapojiita chenyewe, lazima kibadilishe kigezo chake ili kisongee karibu kidogo na Sharti la Kusimama.\n\n### Kwa nini kutoa?\nKatika mfano huu, tunatayarisha kuhesabu kurudi nyuma. Kwa hivyo, kila hatua lazima iwe ndogo kuliko ya mwisho.\n- Hatua ya 1: `hesabu(3)`\n- Hatua ya 2: `hesabu(2)`\n- Hatua ya 3: `hesabu(1)`\n- Hatua ya 4: `hesabu(0)` -> **SIMAMA!**\n\n**Kazi Yako:** Kamilisha Hatua ya Kujirudia kwa kupitisha `n - 1` kwenye mwito wa kitendakazi.\n\n```nuru\nfanya hesabu = unda(n) {\n    kama (n <= 0) {\n        andika(\"Imekamilika!\")\n        rudisha tupu\n    }\n\n    andika(n)\n    hesabu(+++n - 1+++)\n}\n\nhesabu(3)\n```"}', '{"en": "Fix the recursive call `hesabu(n)` so that it passes `n - 1` instead. This brings us closer to the base case!", "sw": "Rekebisha mwito wa kujirudia `hesabu(n)` ili upitishe `n - 1` badala yake. Hii inatuleta karibu na sharti la kusimama!"}', 'fanya hesabu = unda(n) {
    kama (n <= 0) {
        andika("Imekamilika!")
        rudisha tupu
    }

    andika(n)
    hesabu() 
}

hesabu(3)
', 'fanya hesabu = unda(n) {
    kama (n <= 0) {
        andika("Imekamilika!")
        rudisha tupu
    }

    andika(n)
    hesabu(n - 1)
}

hesabu(3)
', '[{"id": "kujirudia_recursive_step_output", "type": "io", "message": "The program must output 3, 2, 1, and ''Imekamilika!''. / Programu inapaswa kutoa 3, 2, 1, na ''Imekamilika!''.", "isPublic": true, "expectedOutput": "3\n2\n1\nImekamilika!"}, {"id": "kujirudia_recursive_step_code", "type": "match_code", "message": "You must pass ''n - 1'' to the recursive ''hesabu'' call. / Lazima upitishe ''n - 1'' kwenye wito wa kitendakazi cha hesabu.", "pattern": "\\bhesabu\\s*\\(\\s*n\\s*-\\s*1\\s*\\)", "isPublic": true}]', 2, '2026-05-20 00:59:52.418553+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('743f70b6-f6db-4345-b2f0-b70c6e53e5ef', '451c3616-5844-422e-af37-3cd4fa4c57ff', 'calculator', '{"en": "9. Mini-Project: Calculator", "sw": "9. Mradi Mdogo: Kikokotozi"}', '{"en": "Congratulations on making it this far! You''ve learned how to create functions, pass arguments, return values, and even handle scope and closures.\n\nNow, let''s build something useful: a **Calculator**.\n\n### Using Logical Decisions:\nWe can use the `kama` (if) statement to check what the user wants to do. If `tendo == \"jumla\"`, we add the numbers. \n\n### Why this matters:\nThis pattern is used everywhere! From deciding which button a user clicked on a website to deciding how a character moves in a game.\n\n**Your Task:** Complete the logic by writing `rudisha a - b`, `rudisha a * b`, and `rudisha a / b` inside the respective `kama` blocks. Also, remove the `//` from the test calls at the bottom!\n\n```s\nfanya kikokotozi = unda(a, b, tendo) {\n    kama (tendo == \"jumla\") {\n        rudisha a + b\n    }\n    kama (tendo == \"toa\") {\n        +++rudisha a - b+++\n    }\n    kama (tendo == \"zidisha\") {\n        +++rudisha a * b+++\n    }\n    kama (tendo == \"gawanya\") {\n        +++rudisha a / b+++\n    }\n    rudisha \"Tendo halijulikani\"\n}\n\nandika(\"10 + 5 =\", kikokotozi(10, 5, \"jumla\"))\n+++andika(\"10 - 5 =\", kikokotozi(10, 5, \"toa\"))+++\n+++andika(\"10 * 5 =\", kikokotozi(10, 5, \"zidisha\"))+++\n+++andika(\"10 / 5 =\", kikokotozi(10, 5, \"gawanya\"))+++\n```", "sw": "Hongera kwa kufika mbali hivi! Umejifunza jinsi ya kutengeneza vitendakazi, kupitisha hoja, kurudisha thamani, na hata kushughulikia wigo na closures.\n\nSasa, hebu tujenge kitu cha muhimu: **Kikokotozi** (Calculator).\n\n### Kutumia Maamuzi ya Kimantiki:\nTunatumia sentensi ya `kama` (if) ili kuangalia kile ambacho mtumiaji anataka kufanya. Ikiwa `tendo == \"jumla\"`, tunajumlisha namba hizo.\n\n### Kwa nini hii ni muhimu?\nMfumo huu unatumika kila mahali! Kuanzia kuamua ni kitufe gani mtumiaji alibonyeza kwenye tovuti hadi kuamua jinsi mhusika anavyosogea kwenye mchezo wa video (game).\n\n**Kazi Yako:** Kamilisha mantiki kwa kuandika `rudisha a - b`, `rudisha a * b`, na `rudisha a / b` ndani ya vizuizi vya `kama` husika. Pia, toa alama za `//` kwenye majaribio yaliyo chini kabisa!\n\n```s\nfanya kikokotozi = unda(a, b, tendo) {\n    kama (tendo == \"jumla\") {\n        rudisha a + b\n    }\n    kama (tendo == \"toa\") {\n        +++rudisha a - b+++\n    }\n    kama (tendo == \"zidisha\") {\n        +++rudisha a * b+++\n    }\n    kama (tendo == \"gawanya\") {\n        +++rudisha a / b+++\n    }\n    rudisha \"Tendo halijulikani\"\n}\n\nandika(\"10 + 5 =\", kikokotozi(10, 5, \"jumla\"))\n+++andika(\"10 - 5 =\", kikokotozi(10, 5, \"toa\"))+++\n+++andika(\"10 * 5 =\", kikokotozi(10, 5, \"zidisha\"))+++\n+++andika(\"10 / 5 =\", kikokotozi(10, 5, \"gawanya\"))+++\n```"}', '{"en": "Finish the `kikokotozi` (calculator) function by filling in the logic for subtraction, multiplication, and division.", "sw": "Malizia kitendakazi `kikokotozi` (calculator) kwa kujaza mantiki ya kutoa, kuzidisha, na kugawanya."}', 'fanya kikokotozi = unda(a, b, tendo) {
    kama (tendo == "jumla") {
        rudisha a + b
    }
    kama (tendo == "toa") {
        // ?
    }
    kama (tendo == "zidisha") {
        // ?
    }
    kama (tendo == "gawanya") {
        // ?
    }
    rudisha "Tendo halijulikani"
}

andika("10 + 5 =", kikokotozi(10, 5, "jumla"))
// andika("10 - 5 =", kikokotozi(10, 5, "toa"))
// andika("10 * 5 =", kikokotozi(10, 5, "zidisha"))
// andika("10 / 5 =", kikokotozi(10, 5, "gawanya"))
', 'fanya kikokotozi = unda(a, b, tendo) {
    kama (tendo == "jumla") {
        rudisha a + b
    }
    kama (tendo == "toa") {
        rudisha a - b
    }
    kama (tendo == "zidisha") {
        rudisha a * b
    }
    kama (tendo == "gawanya") {
        rudisha a / b
    }
    rudisha "Tendo halijulikani"
}

andika("10 + 5 =", kikokotozi(10, 5, "jumla"))
andika("10 - 5 =", kikokotozi(10, 5, "toa"))
andika("10 * 5 =", kikokotozi(10, 5, "zidisha"))
andika("10 / 5 =", kikokotozi(10, 5, "gawanya"))
', '[{"id": "vitendakazi_calculator_1", "type": "match_code", "message": "The calculator function must take three arguments: two numbers and an operation string. / Kitendakazi cha kikokotozi lazima kichukue hoja tatu: namba mbili na jina la tendo.", "pattern": "\\bfanya\\s+kikokotozi\\s*=\\s*unda\\s*\\(\\s*[a-zA-Z_][a-zA-Z0-9_]*\\s*,\\s*[a-zA-Z_][a-zA-Z0-9_]*\\s*,\\s*[a-zA-Z_][a-zA-Z0-9_]*\\s*\\)", "isPublic": true}, {"id": "vitendakazi_calculator_2", "type": "match_output", "message": "The calculator must return 15 for ''jumla'' (addition). / Kikokotozi lazima kirudishe 15 kwa ''jumla'' (jumlisha).", "pattern": "10 \\+ 5 = 15", "isPublic": true}]', 8, '2026-05-20 00:59:52.075707+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('8460d7e8-37a7-4322-ab8f-7c86bc5e9367', '30a05a13-4345-4304-890c-654e330f7949', 'array-sum', '{"en": "7. Recursion with Arrays", "sw": "7. Kujirudia na Safu (Arrays)"}', '{"en": "You can use recursion to process lists of data! \n\nIf you want to find the sum of all numbers in an array, we can pass an index `i` that keeps track of where we are.\n\n### The Recursive Logic:\n1. **Base Case:** If `i` reaches the end of the array (`orodha.idadi()`), the sum is 0.\n2. **Recursive Step:** Take the current number (`orodha[i]`), and add it to the sum of the *rest* of the array (`jumla(orodha, i + 1)`).\n\n### Visualizing it:\n`jumla([10, 20], 0)`\n- `10 + jumla([10, 20], 1)`\n- `10 + (20 + jumla([10, 20], 2))`\n- `10 + (20 + 0)` = **30**\n\n**Your Task:** Complete the logic for `jumla` by writing +++rudisha orodha[i] + jumla(orodha, i + 1)+++. This will sum up all items in the list.\n\n```nuru\nfanya jumla = unda(orodha, i=0) {\n    kama (i == orodha.idadi()) {\n        rudisha 0\n    }\n    \n    +++rudisha orodha[i] + jumla(orodha, i + 1)+++\n}\n\nandika(jumla([10, 20, 30]))\n```", "sw": "Unaweza kutumia kujirudia kuchakata orodha za data!\n\nIkiwa unataka kupata jumla ya namba zote kwenye safu (array), tunaweza kupitisha namba `i` inayoonyesha tupo wapi.\n\n### Mantiki ya Kujirudia:\n1. **Kesi ya Msingi:** Ikiwa `i` inafika mwisho wa safu (`orodha.idadi()`), jumla ni 0.\n2. **Hatua ya Kujirudia:** Chukua namba ya sasa (`orodha[i]`), na uijumlishe kwa jumla ya *safu iliyosalia* (`jumla(orodha, i + 1)`).\n\n### Kuiona Kimantiki:\n`jumla([10, 20], 0)`\n- `10 + jumla([10, 20], 1)`\n- `10 + (20 + jumla([10, 20], 2))`\n- `10 + (20 + 0)` = **30**\n\n**Kazi Yako:** Kamilisha mantiki ya `jumla` kwa kuandika +++rudisha orodha[i] + jumla(orodha, i + 1)+++. Hii itajumlisha vitu vyote kwenye orodha.\n\n```nuru\nfanya jumla = unda(orodha, i=0) {\n    kama (i == orodha.idadi()) {\n        rudisha 0\n    }\n    \n    +++rudisha orodha[i] + jumla(orodha, i + 1)+++\n}\n\nandika(jumla([10, 20, 30]))\n```"}', '{"en": "Complete the `jumla` function to return `orodha[i] + jumla(orodha, i + 1)`.", "sw": "Kamilisha kitendakazi `jumla` ili kirudishe `orodha[i] + jumla(orodha, i + 1)`."}', 'fanya jumla = unda(orodha, i=0) {
    // Base Case: We have reached the end of the array
    kama (i == orodha.idadi()) {
        rudisha 0
    }
    
    // Recursive Step: Current item + sum of the rest
    rudisha 
}

andika(jumla([10, 20, 30])) // Should be 60
', 'fanya jumla = unda(orodha, i=0) {
    kama (i == orodha.idadi()) {
        rudisha 0
    }
    rudisha orodha[i] + jumla(orodha, i + 1)
}

andika(jumla([10, 20, 30]))
', '[{"id": "kujirudia_arraysum_output", "type": "io", "message": "The program must print ''Jumla ni: 15''. / Programu lazima ichapishe ''Jumla ni: 15''.", "isPublic": true, "expectedOutput": "Jumla ni: 15"}, {"id": "kujirudia_arraysum_recurse", "type": "match_code", "message": "The sum function should recursively call itself. / Kitendakazi cha sum kinapaswa kujiita chenyewe.", "pattern": "sum\\s*\\(.*\\)", "isPublic": true}]', 6, '2026-05-20 00:59:52.763162+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('c0a2f5a2-3b73-4eec-8059-de2e858ee4b4', '30a05a13-4345-4304-890c-654e330f7949', 'call-stack', '{"en": "5. The Call Stack", "sw": "5. Msururu wa Wito (Call Stack)"}', '{"en": "What just happened? Why did it count UP instead of down?\n\nThis introduces the **Call Stack**. When a function calls another function, the first function **pauses** and waits for the second one to finish. \n\n### Why the order matters:\nIf we call `hesabu(n-1)` *before* we print, the computer will keep pausing and \"stacking\" the functions on top of each other until it hits `0`. \n\nOnce the `0` function finishes (returns), the computer resumes where it left off in the `1` function, then the `2` function, and so on.\n\n### The Stack Order:\n- `hesabu(5)` (Paused)\n- `hesabu(4)` (Paused)\n- `hesabu(3)` (Paused)\n- `hesabu(2)` (Paused)\n- `hesabu(1)` (Running) -> Prints 1\n- `hesabu(2)` (Resumed) -> Prints 2\n\n**Your Task:** Add `andika(n)` below `hesabu(n - 1)` to see this \"unwinding\" in action.\n\n```nuru\nfanya hesabu = unda(n) {\n    kama (n <= 0) {\n        rudisha tupu\n    }\n    \n    hesabu(n - 1)\n    +++andika(n)+++\n}\n\nhesabu(5)\n```", "sw": "Nini kimetokea? Kwa nini imehesabu KWENDA JUU badala ya chini?\n\nHii inatambulisha **Msururu wa Wito** (Call Stack). Kitendakazi kinapoita kitendakazi kingine, kitendakazi cha kwanza **hupumzika** na kusubiri cha pili kimalize.\n\n### Kwa nini mpangilio ni muhimu:\nIkiwa tutaita `hesabu(n-1)` *kabla* ya kuandika, kompyuta itaendelea kupumzika na \"kupanga\" vitendakazi juu ya vingine hadi ifike `0`.\n\nMara tu kitendakazi cha `0` kinapomaliza, kompyuta inaendelea pale ilipoishia kwenye kitendakazi cha `1`, kisha cha `2`, na kuendelea.\n\n### Mpangilio wa Msururu:\n- `hesabu(5)` (Imepumzika)\n- `hesabu(4)` (Imepumzika)\n- `hesabu(3)` (Imepumzika)\n- `hesabu(2)` (Imepumzika)\n- `hesabu(1)` (Inafanya kazi) -> Inaandika 1\n- `hesabu(2)` (Inaendelea) -> Inaandika 2\n- ... na kuendelea.\n\n**Kazi Yako:** Ongeza +++andika(n)+++ chini ya +++hesabu(n - 1)+++ ili uone \"ufunguzi\" huu ukifanyika. Itaandika namba kwa mpangilio wa kinyume (1, 2, 3, 4, 5)!\n\n```nuru\nfanya hesabu = unda(n) {\n    kama (n <= 0) {\n        rudisha tupu\n    }\n    \n    hesabu(n - 1)\n    +++andika(n)+++\n}\n\nhesabu(5)\n```"}', '{"en": "Place `andika(n)` *after* the recursive call `hesabu(n - 1)` to see how the call stack ''unwinds''.", "sw": "Weka `andika(n)` *baada* ya `hesabu(n - 1)` ili uone jinsi msururu wa wito unavyofunguka."}', 'fanya hesabu = unda(n) {
    kama (n <= 0) {
        rudisha tupu
    }
    
    hesabu(n - 1)
}

hesabu(5)
', 'fanya hesabu = unda(n) {
    kama (n <= 0) {
        rudisha tupu
    }
    
    hesabu(n - 1)
    andika(n)
}

hesabu(5)
', '[{"id": "kujirudia_call_stack_output", "type": "io", "message": "The program must output numbers from 1 to 5. Make sure ''andika(n)'' is placed after the recursive call. / Programu inapaswa kutoa nambari kuanzia 1 hadi 5. Hakikisha ''andika(n)'' imewekwa baada ya wito wa kujirudia.", "isPublic": true, "expectedOutput": "1\n2\n3\n4\n5"}, {"id": "kujirudia_call_stack_order", "type": "match_code", "message": "You must place ''andika(n)'' AFTER ''hesabu(n - 1)''. / Lazima uweke ''andika(n)'' BAADA ya ''hesabu(n - 1)''.", "pattern": "\\bhesabu\\s*\\(\\s*n\\s*-\\s*1\\s*\\)[\\s;]*\\bandika\\s*\\(\\s*n\\s*\\)", "isPublic": true}, {"id": "kujirudia_call_stack_call", "type": "match_code", "message": "Make sure to call ''hesabu(5)'' at the bottom of your code. / Hakikisha unaita ''hesabu(5)'' chini kabisa ya kodi yako.", "pattern": "\\bhesabu\\s*\\(\\s*5\\s*\\)", "isPublic": true}]', 4, '2026-05-20 00:59:52.59075+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('32223f29-0a09-4f30-90e5-b0cb30694ea3', 'e9217ef6-692e-4585-8b20-902bab3c433d', 'recursive-sum', '{"en": "3. Adding the Past (Recursive Step)", "sw": "3. Kujumlisha Yaliyopita (Recursive Step)"}', '{"en": "Now for the magic! To find any Fibonacci number, the computer just needs to ask: \"What are the two numbers before me?\"\n\n### Recursive Step:\nIn Nuru, we write this as:\n`rudisha fibo(n - 1) + fibo(n - 2)`\n\n### How the computer sees it:\nIf you ask for `fibo(2)`:\n1. It calls `fibo(1)` (which returns 1).\n2. It calls `fibo(0)` (which returns 0).\n3. It adds them: `1 + 0 = 1`.\n\n**Your Task:** Complete the recursive step! Make the function call itself twice to get the sum of the previous two numbers.\n\n```nuru\nrudisha +++fibo(n - 1) + fibo(n - 2)+++\n```", "sw": "Sasa kwa maajabu yenyewe! Ili kupata namba yoyote ya Fibonacci, kompyuta inahitaji tu kuuliza: \"Ni namba gani mbili zilizo nyuma yangu?\"\n\n### Hatua ya Kujirudia:\nKatika Nuru, tunaandika hivi:\n`rudisha fibo(n - 1) + fibo(n - 2)`\n\n### Jinsi kompyuta inavyoiona:\nUkiomba `fibo(2)`:\n1. Inaita `fibo(1)` (ambayo inarudisha 1).\n2. Inaita `fibo(0)` (ambayo inarudisha 0).\n3. Inazijumlisha: `1 + 0 = 1`.\n\n**Kazi Yako:** Kamilisha hatua ya kujirudia! Fanya kitendakazi kijiite mara mbili ili kupata jumla ya namba mbili zilizopita.\n\n```nuru\nrudisha +++fibo(n - 1) + fibo(n - 2)+++\n```"}', '{"en": "Complete the `fibo` function by returning the sum of `fibo(n-1)` and `fibo(n-2)`.", "sw": "Kamilisha kitendakazi cha `fibo` kwa kurudisha jumla ya `fibo(n-1)` na `fibo(n-2)`."}', 'fanya fibo = unda(n) {
    kama (n <= 1) {
        rudisha n
    }
    
    // Recursive Step: Add the two previous Fibonacci numbers
    rudisha // fibo(n-1) + fibo(n-2)
}

andika("Fibonacci of 5 is:", fibo(5)) // Should be 5
andika("Fibonacci of 6 is:", fibo(6)) // Should be 8
', 'fanya fibo = unda(n) {
    kama (n <= 1) {
        rudisha n
    }
    rudisha fibo(n - 1) + fibo(n - 2)
}

andika("Fibonacci of 5 is:", fibo(5))
andika("Fibonacci of 6 is:", fibo(6))
', '[{"id": "fibo_recursive_output_5", "type": "match_output", "message": "fibo(5) must return 5 / fibo(5) lazima irudishe 5", "pattern": "Fibonacci of 5 is:\\s*5\\b", "isPublic": true}, {"id": "fibo_recursive_output_6", "type": "match_output", "message": "fibo(6) must return 8 / fibo(6) lazima irudishe 8", "pattern": "Fibonacci of 6 is:\\s*8\\b", "isPublic": true}, {"id": "fibo_recursive_calls", "type": "match_code", "message": "You must recursively return the sum of the two previous values: `fibo(n - 1) + fibo(n - 2)` / Lazima urudishe kwa urudiaji (recursively) jumla ya thamani mbili zilizopita: `fibo(n - 1) + fibo(n - 2)`", "pattern": "\\brudisha\\s+(?:fibo\\s*\\(\\s*n\\s*-\\s*1\\s*\\)\\s*\\+\\s*fibo\\s*\\(\\s*n\\s*-\\s*2\\s*\\)|fibo\\s*\\(\\s*n\\s*-\\s*2\\s*\\)\\s*\\+\\s*fibo\\s*\\(\\s*n\\s*-\\s*1\\s*\\))", "isPublic": true}]', 2, '2026-05-20 00:59:53.197944+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('e64e758a-0f7b-4f5e-a82c-4ea6516eea01', 'e9217ef6-692e-4585-8b20-902bab3c433d', 'intro', '{"en": "1. The Golden Sequence", "sw": "1. Msururu wa Fibonacci"}', '{"en": "The **Fibonacci sequence** is a famous mathematical pattern often found in nature—from snail shells to flower petals.\n\nIt starts with **0** and **1**. After that, every new number is just the **sum of the two numbers before it**.\n\n### The Pattern:\n- 0 + 1 = **1**\n- 1 + 1 = **2**\n- 1 + 2 = **3**\n- 2 + 3 = **5**\n- 3 + 5 = **8**\n- 5 + 8 = **13**\n\n**Your Task:** Look at the pattern above. If the last number is 13, what are the next two numbers in the sequence? Write them in the code! (Hint: 8+13=?)\n\n```nuru\nfanya namba_moja = 13\nfanya namba_mbili = +++21+++\n\nandika(namba_moja, namba_mbili)\n```", "sw": "**Msururu wa Fibonacci** ni mfumo maarufu wa kihisabati ambao mara nyingi unapatikana katika asili—kuanzia kwenye makombora ya konokono hadi petali za maua.\n\nInaanza na **0** na **1**. Baada ya hapo, kila namba mpya ni **jumla ya namba mbili zilizotangulia**.\n\n### Mfumo Wake:\n- 0 + 1 = **1**\n- 1 + 1 = **2**\n- 1 + 2 = **3**\n- 2 + 3 = **5**\n- 3 + 5 = **8**\n- 5 + 8 = **13**\n\n**Kazi Yako:** Angalia mfumo hapo juu. Ikiwa namba ya mwisho ni 13, ni namba gani mbili zinazofuata katika msururu huu? Ziandike kwenye kodi! (Dokezo: 8+13=?)\n\n```nuru\nfanya namba_moja = 13\nfanya namba_mbili = +++21+++\n\nandika(namba_moja, namba_mbili)\n```"}', '{"en": "Calculate the next two numbers in the Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, __, __.", "sw": "Kokotoa namba mbili zinazofuata katika msururu wa Fibonacci: 0, 1, 1, 2, 3, 5, 8, __, __."}', 'fanya namba_moja = 13
fanya namba_mbili = // nini?

andika(namba_moja, namba_mbili)
', 'fanya namba_moja = 13
fanya namba_mbili = 21

andika(namba_moja, namba_mbili)
', '[{"id": "fibo_intro_output", "type": "match_output", "message": "The output must print the next two numbers: 13 and 21 / Matokeo lazima yaonyeshe namba mbili zinazofuata: 13 na 21", "pattern": "13\\s+21", "isPublic": true}, {"id": "fibo_intro_var_moja", "type": "match_code", "message": "Make sure you define `namba_moja` with the value 13 / Hakikisha unafafanua `namba_moja` yenye thamani ya 13", "pattern": "fanya\\s+namba_moja\\s*=\\s*13\\b", "isPublic": true}, {"id": "fibo_intro_var_mbili", "type": "match_code", "message": "Make sure you calculate and define `namba_mbili` as 21 / Hakikisha unakokotoa na kufafanua `namba_mbili` kama 21", "pattern": "fanya\\s+namba_mbili\\s*=\\s*21\\b", "isPublic": true}, {"id": "fibo_intro_andika", "type": "match_code", "message": "You must output the two variables using `andika(namba_moja, namba_mbili)` / Lazima utoe matokeo ya vigezo hivyo viwili kwa kutumia `andika(namba_moja, namba_mbili)`", "pattern": "andika\\s*\\(\\s*namba_moja\\s*,\\s*namba_mbili\\s*\\)", "isPublic": true}]', 0, '2026-05-20 00:59:53.023141+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('7d2730b9-12c1-4528-aebb-abe052a748c9', 'e9217ef6-692e-4585-8b20-902bab3c433d', 'memoization', '{"en": "6. Remembering Results (Memoization)", "sw": "6. Kukumbuka Matokeo (Memoization)"}', '{"en": "How do we make Fibonacci fast? We give the function a **Memory**!\n\nIn computer science, this is called **Memoization**. Every time we calculate a number, we save it in a dictionary. Next time we need it, we just look it up instead of recalculating it.\n\n### Why it''s fast:\nWith memory, `fibo(30)` goes from 2 Million calls down to just **30 calls**. That is a massive speed boost!\n\n**Your Task:** Finish the `if` statement to return the stored value if it exists in `kumbukumbu[n]`. (In Nuru, we use `tupu` to check if a value is missing).\n\n```nuru\nkama (kumbukumbu[n] != tupu) {\n    +++rudisha kumbukumbu[n]+++\n}\n```", "sw": "Tunafanyaje Fibonacci iwe haraka? Tunakipa kitendakazi **Kumbukumbu**!\n\nKatika sayansi ya kompyuta, hii inaitwa **Memoization**. Kila wakati tunapokokotoa namba, tunaihifadhi kwenye kamusi (dictionary). Wakati mwingine tukiihitaji, tunaiangalia tu badala ya kuikokotoa upya.\n\n### Kwa nini ni haraka:\nUkiwa na kumbukumbu, `fibo(30)` inatoka kwenye wito Milioni 2 hadi wito **30** tu. Hiyo ni ongezeko kubwa sana la kasi!\n\n**Kazi Yako:** Malizia sentensi ya `kama` ili kurudisha thamani iliyohifadhiwa ikiwa ipo kwenye `kumbukumbu[n]`. (Katika Nuru, tunatumia `tupu` kuangalia ikiwa thamani haipo).\n\n```nuru\nkama (kumbukumbu[n] != tupu) {\n    +++rudisha kumbukumbu[n]+++\n}\n```"}', '{"en": "Complete the `fibo_fast` function to check if the result is already in the `kumbukumbu` (memory) dictionary.", "sw": "Kamilisha kitendakazi cha `fibo_haraka` ili kuangalia ikiwa matokeo tayari yapo kwenye kamusi ya `kumbukumbu`."}', 'fanya kumbukumbu = {}

fanya fibo_fast = unda(n) {
    kama (n <= 1) { rudisha n }

    // 1. Check kama we already know the answer!
    kama (kumbukumbu[n] != tupu) {
        andika("Nakumbuka namba", n)
        // Rudiasha jibu kutoka kumbukumbu hapa
    }

    // 2. Otherwise, calculate and SAVE IT
    fanya jibu = fibo_fast(n - 1) + fibo_fast(n - 2)
    kumbukumbu[n] = jibu
    rudisha jibu
}

andika(fibo_fast(10))
', 'fanya kumbukumbu = {}

fanya fibo_fast = unda(n) {
    kama (n <= 1) { rudisha n }

    kama (kumbukumbu[n] != tupu) {
        rudisha kumbukumbu[n]
    }

    fanya jibu = fibo_fast(n - 1) + fibo_fast(n - 2)
    kumbukumbu[n] = jibu
    rudisha jibu
}

andika(fibo_fast(10))
', '[{"id": "fibo_memo_output", "type": "match_output", "message": "The output of fibo_fast(10) must be 55 / Matokeo ya fibo_fast(10) lazima yawe 55", "pattern": "55\\b", "isPublic": true}, {"id": "fibo_memo_return", "type": "match_code", "message": "You must return the memoized value from the dictionary / Lazima urudishe thamani iliyohifadhiwa kutoka kwenye kamusi (dictionary)", "pattern": "kama\\s*\\(\\s*kumbukumbu\\s*\\[\\s*n\\s*\\]\\s*!=\\s*tupu\\s*\\)\\s*\\{[^}]*\\brudisha\\s+kumbukumbu\\s*\\[\\s*n\\s*\\]", "isPublic": true}]', 5, '2026-05-20 00:59:53.458196+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('e0390578-3593-4768-8432-b74759d8ddc1', '4cf86550-82b2-4372-adad-348f00aa6cf4', 'intro', '{"en": "1. The Power of Order", "sw": "1. Nguvu ya Mpangilio"}', '{"en": "Why do we care about **Sorting**? \n\nImagine looking for a word in a dictionary where the pages were in a random order. It would take hours! Because dictionaries are **Sorted** (A-Z), you can find any word in seconds.\n\nIn computer science, sorting is the foundation of fast searching.\n\n**Your Task:** Run the code. Notice how much easier it is for a human (and a computer) to reason about a list that is in order. We''re going to learn the most powerful sorting algorithm: **Merge Sort**.\n\n```nuru\nfanya orodha_mbaya = [10, 5, 42, 3, 99, 1]\nfanya orodha_nzuri = [1, 3, 5, 10, 42, 99]\n\n// No code to write yet, just run and think!\nandika(\"Orodha mbaya:\", orodha_mbaya)\n+++andika(\"Orodha nzuri:\", orodha_nzuri)+++\n```", "sw": "Kwa nini tunajali kuhusu **Kupanga** (Sorting)?\n\nFikiria unatafuta neno kwenye kamusi ambapo kurasa zimepangwa kiholela. Itachukua saa nyingi! Kwa sababu kamusi **Zimepangwa** (A-Z), unaweza kupata neno lolote ndani ya sekunde chache.\n\nKatika sayansi ya kompyuta, kupanga ndio msingi wa utafutaji wa haraka.\n\n**Kazi Yako:** Endesha kodi. Angalia jinsi ilivyo rahisi kwa binadamu (na kompyuta) kuelewa orodha ambayo imepangwa. Tutajifunza algoriti yenye nguvu zaidi ya kupanga: **Merge Sort**.\n\n```nuru\nfanya orodha_mbaya = [10, 5, 42, 3, 99, 1]\nfanya orodha_nzuri = [1, 3, 5, 10, 42, 99]\n\n// Hakuna kodi ya kuandika bado, endesha && ufikirie!\nandika(\"Orodha mbaya:\", orodha_mbaya)\n+++andika(\"Orodha nzuri:\", orodha_nzuri)+++\n```"}', '{"en": "Try to find the number 42 in the unsorted list. How many steps did it take? Then find it in the sorted list.", "sw": "Jaribu kutafuta namba 42 katika orodha isiyopangwa. Ilichukua hatua ngapi? Kisha itafute kwenye orodha iliyopangwa."}', 'fanya orodha_mbaya = [10, 5, 42, 3, 99, 1]
fanya orodha_nzuri = [1, 3, 5, 10, 42, 99]

// No code to write yet, just run and think!
andika("Orodha mbaya:", orodha_mbaya)
', 'fanya orodha_mbaya = [10, 5, 42, 3, 99, 1]
fanya orodha_nzuri = [1, 3, 5, 10, 42, 99]

// No code to write yet, just run and think!
andika("Orodha mbaya:", orodha_mbaya)
andika("Orodha nzuri:", orodha_nzuri)
', '[{"id": "sorting_intro_output", "type": "match_output", "message": "The sorted list must be printed correctly. / Orodha iliyopangwa lazima ichapishwe kwa usahihi.", "pattern": "Orodha nzuri:\\s*\\[\\s*1,\\s*3,\\s*5,\\s*10,\\s*42,\\s*99\\s*\\]", "isPublic": true}, {"id": "sorting_intro_code", "type": "match_code", "message": "Make sure you call andika with ''Orodha nzuri:'' and orodha_nzuri. / Hakikisha unaita andika na ''Orodha nzuri:'' na orodha_nzuri.", "pattern": "andika\\s*\\(\\s*([''\"])Orodha nzuri:\\1\\s*,\\s*orodha_nzuri\\s*\\)", "isPublic": true}]', 0, '2026-05-20 00:59:53.716001+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('38b08ca0-9da6-46e2-9b85-8c5266e94e0a', 'e9217ef6-692e-4585-8b20-902bab3c433d', 'visualization', '{"en": "4. The Tree of Calls", "sw": "4. Mti wa Wito (Tree of Calls)"}', '{"en": "When a function calls itself twice, it creates a **Tree of Calls**.\n\nTo find `fibo(5)`, the computer doesn''t just do 5 steps. It actually calls the function **15 times**!\n\n### Why?\n- `fibo(5)` calls `fibo(4)` and `fibo(3)`.\n- `fibo(4)` calls `fibo(3)` and `fibo(2)`.\n- Notice how `fibo(3)` is being calculated twice? As `n` gets bigger, the computer starts repeating the same work over and over again.\n\n**Your Task:** Run the code for `fibo(5)` and look at the output. Can you believe it took 15 calls just for the number 5? Imagine how many it takes for 30!\n\n```nuru\nfanya jibu = fibo(+++5+++)\n```", "sw": "Wakati kitendakazi kinapojiita mara mbili, kinatengeneza kile kinachoitwa **Mti wa Wito** (Tree of Calls).\n\nIli kupata `fibo(5)`, kompyuta haifanyi hatua 5 tu. Inaita kitendakazi mara **15**!\n\n### Kwa nini?\n- `fibo(5)` inaita `fibo(4)` na `fibo(3)`.\n- `fibo(4)` inaita `fibo(3)` na `fibo(2)`.\n- Angalia jinsi `fibo(3)` inavyokokotolewa mara mbili? Kadiri `n` inavyokuwa kubwa, kompyuta inaanza kurudia kazi ile ile mara nyingi sana.\n\n**Kazi Yako:** Endesha kodi kwa ajili ya `fibo(5)` na utazame matokeo. Je, unaamini ilichukua wito 15 kwa namba 5 tu? Fikiria itachukua ngapi kwa namba 30!\n\n```nuru\nfanya jibu = fibo(+++5+++)\n```"}', '{"en": "Run the code and watch how many times `fibo` is called just to find the 5th number.", "sw": "Endesha kodi na utazame ni mara ngapi `fibo` inaitwa ili tu kupata namba ya 5."}', 'fanya hesabu = 0

fanya fibo = unda(n) {
    hesabu = hesabu + 1
    andika("Nimeitwa kwa n =", n)

    kama (n <= 1) {
        rudisha n
    }
    rudisha fibo(n - 1) + fibo(n - 2)
}

fanya jibu = fibo() // Weka namba hapa
andika("------------------")
andika("Jibu ni:", jibu)
andika("Jumla ya mara zilizoitwa:", hesabu)
', 'fanya hesabu = 0

fanya fibo = unda(n) {
    hesabu = hesabu + 1
    andika("Nimeitwa kwa n =", n)

    kama (n <= 1) {
        rudisha n
    }
    rudisha fibo(n - 1) + fibo(n - 2)
}

fanya jibu = fibo(5)
andika("------------------")
andika("Jibu ni:", jibu)
andika("Jumla ya mara zilizoitwa:", hesabu)
', '[{"id": "fibo_vis_output_ans", "type": "match_output", "message": "The answer must be 5 / Jibu lazima liwe 5", "pattern": "Jibu ni:\\s*5\\b", "isPublic": true}, {"id": "fibo_vis_output_calls", "type": "match_output", "message": "The total number of calls must be 15 / Jumla ya mara zilizoitwa lazima iwe 15", "pattern": "Jumla ya mara zilizoitwa:\\s*15\\b", "isPublic": true}, {"id": "fibo_vis_code_call", "type": "match_code", "message": "You must call `fibo(5)` to see the visualization / Lazima uite `fibo(5)` ili kuona taswira", "pattern": "fibo\\s*\\(\\s*5\\s*\\)", "isPublic": true}]', 3, '2026-05-20 00:59:53.285458+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('beff3fd0-4897-484e-b0d9-2bce522a3ee1', '4cf86550-82b2-4372-adad-348f00aa6cf4', 'efficiency', '{"en": "6. Why Merge Sort?", "sw": "6. Kwa nini Merge Sort?"}', '{"en": "Why did we do all this work? Why not just use a simple loop?\n\nThere are many ways to sort, like **Bubble Sort**. But Bubble Sort is slow—as the list gets 10 times bigger, it takes 100 times longer!\n\n**Merge Sort** is much more efficient. Because it always splits the problem in half, it is incredibly fast even for millions of items. In computer science, we call this $O(N \\log N)$ efficiency.\n\n### Congratulations!\nYou now understand:\n1. **Divide and Conquer:** Breaking big problems into small pieces.\n2. **Merging Logic:** Combining results in order.\n3. **Algorithmic Efficiency:** Why the way we write code matters for speed.\n\n**Your Task:** Run the code and watch it effortlessly sort 100 numbers. You''ve just implemented a professional-grade sorting algorithm!\n\n```nuru\nandika(\"Sorting 100 items...\")\n+++andika(panga(orodha_kubwa))+++\n```", "sw": "Kwa nini tulifanya kazi hii yote? Kwa nini tusitumie tu kitanzi (loop) rahisi?\n\nKuna njia nyingi za kupanga, kama **Bubble Sort**. Lakini Bubble Sort ni polepole—orodha ikiwa kubwa mara 10 zaidi, inachukua muda mrefu mara 100!\n\n**Merge Sort** ina ufanisi zaidi. Kwa sababu kila wakati inagawanya tatizo nusu, ina kasi ya ajabu hata kwa mamilioni ya vitu. Katika sayansi ya kompyuta, tunaita hii ufanisi wa $O(N \\log N)$.\n\n### Hongera sana!\nSasa unaelewa:\n1. **Kugawanya Tatizo:** Kuvunja matatizo makubwa kuwa vipande vidogo na rahisi zaidi.\n2. **Mantiki ya Kuunganisha:** Kuchanganya matokeo kwa mpangilio sahihi.\n3. **Ufanisi wa Algorithmic:** Kwa nini jinsi tunavyoandika kodi ni muhimu kwa kasi ya programu.\n\n**Kazi Yako:** Endesha kodi na utazame inavyopanga namba 100 bila shida. Umetoka tu kutekeleza algorithm ya kupanga ya kiwango cha juu!\n\n```nuru\nandika(\"Inapanga vitu 100...\")\n+++andika(panga(orodha_kubwa))+++\n```"}', '{"en": "Run the code to see how Merge Sort handles a list of 100 items.", "sw": "Endesha kodi kuona jinsi Merge Sort inavyoshughulikia orodha ya vitu 100."}', '// Kisaidizi cha kukata orodha (Helper to slice arrays)
fanya kata = unda(orodha, anza, mwisho = -1) {
    kama (mwisho == -1) { mwisho = orodha.idadi() }
    fanya mpya = []
    kwa i, t ktk orodha { kama (i >= anza && i < mwisho) { mpya.sukuma(t) } }
    rudisha mpya
}


// Let''s generate a big list of 100 numbers
fanya orodha_kubwa = []
fanya i = 100
wakati (i > 0) {
    orodha_kubwa.sukuma(i)
    i = i - 1
}

// Use the Merge Sort we built!
fanya unganisha = unda(a, b) {
    fanya matokeo = []
    wakati (a.idadi() > 0 && b.idadi() > 0) {
        kama (a[0] < b[0]) {
            matokeo.sukuma(a[0])
            a = kata(a, 1)
        } sivyo {
            matokeo.sukuma(b[0])
            b = kata(b, 1)
        }
    }
    rudisha matokeo + a + b
}

fanya panga = unda(orodha) {
    kama (orodha.idadi() <= 1) { rudisha orodha }
    fanya kati = orodha.idadi() / 2
    fanya kushoto = panga(kata(orodha, 0, kati))
    fanya kulia = panga(kata(orodha, kati))
    rudisha unganisha(kushoto, kulia)
}

andika("Sorting 100 items...")
', '// Kisaidizi cha kukata orodha (Helper to slice arrays)
fanya kata = unda(orodha, anza, mwisho = -1) {
    kama (mwisho == -1) { mwisho = orodha.idadi() }
    fanya mpya = []
    kwa i, t ktk orodha { kama (i >= anza && i < mwisho) { mpya.sukuma(t) } }
    rudisha mpya
}


fanya orodha_kubwa = []
fanya i = 100
wakati (i > 0) {
    orodha_kubwa.sukuma(i)
    i = i - 1
}

fanya unganisha = unda(a, b) {
    fanya matokeo = []
    wakati (a.idadi() > 0 && b.idadi() > 0) {
        kama (a[0] < b[0]) {
            matokeo.sukuma(a[0])
            a = kata(a, 1)
        } sivyo {
            matokeo.sukuma(b[0])
            b = kata(b, 1)
        }
    }
    rudisha matokeo + a + b
}

fanya panga = unda(orodha) {
    kama (orodha.idadi() <= 1) { rudisha orodha }
    fanya kati = orodha.idadi() / 2
    fanya kushoto = panga(kata(orodha, 0, kati))
    fanya kulia = panga(kata(orodha, kati))
    rudisha unganisha(kushoto, kulia)
}

andika("Sorting 100 items...")
andika(panga(orodha_kubwa))
', '[{"id": "sorting_efficiency_output_msg", "type": "match_output", "message": "The output must start with ''Sorting 100 items...''. / Matokeo lazima yaanze na ''Sorting 100 items...''.", "pattern": "Sorting 100 items\\.\\.\\.", "isPublic": true}, {"id": "sorting_efficiency_output_list", "type": "match_output", "message": "The sorted array of 100 numbers must be printed correctly. / Orodha iliyopangwa ya namba 100 lazima ichapishwe kwa usahihi.", "pattern": "\\[\\s*1,\\s*2,\\s*3,\\s*4,\\s*5", "isPublic": true}, {"id": "sorting_efficiency_code", "type": "match_code", "message": "Make sure you call andika with panga(orodha_kubwa). / Hakikisha unaita andika na panga(orodha_kubwa).", "pattern": "andika\\s*\\(\\s*panga\\s*\\(\\s*orodha_kubwa\\s*\\)\\s*\\)", "isPublic": true}]', 5, '2026-05-20 00:59:54.15826+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('07cb0f94-8c5c-46b4-ab79-ab260ce219b7', '4cf86550-82b2-4372-adad-348f00aa6cf4', 'conquer', '{"en": "3. When to Stop (Base Case)", "sw": "3. Lini wa Kusimama (Kesi ya Msingi)"}', '{"en": "How far can we split a list? \n\nEventually, we will have a list with only **one item**. \n\n### The Insight:\nA list with only one number is **already sorted**! \n- Is `[5]` sorted? Yes! \n- Is `[1]` sorted? Yes!\n\nThis is our **Base Case**. Once we reach a list of size 1, we stop splitting and start merging them back together.\n\n**Your Task:** Add the Base Case. If `orodha.idadi()` is 1 or less, return the list immediately.\n\n```nuru\nfanya panga = unda(orodha) {\n    kama (orodha.idadi() <= 1) {\n        +++rudisha orodha+++\n    }\n    rudisha orodha\n}\n\nandika(panga([10]))\n```", "sw": "Je, tunaweza kuigawanya orodha hadi wapi?\n\nHatimaye, tutakuwa na orodha yenye **kitu kimoja** tu.\n\n### Ugunduzi:\nOrodha yenye namba moja tu **tayari imepangwa**!\n- Je, `[5]` imepangwa? Ndiyo!\n- Je, `[1]` imepangwa? Ndiyo!\n\nHii ndiyo **Kesi yetu ya Msingi**. Tukishafika kwenye orodha ya ukubwa wa 1, tunaacha kugawanya na kuanza kuziunganisha tena pamoja kwa mpangilio.\n\n**Kazi Yako:** Ongeza Kesi ya Msingi. Ikiwa `orodha.idadi()` ni 1 au chini ya hapo, rudisha orodha hiyo mara moja.\n\n```nuru\nfanya panga = unda(orodha) {\n    kama (orodha.idadi() <= 1) {\n        +++rudisha orodha+++\n    }\n    rudisha orodha\n}\n\nandika(panga([10]))\n```"}', '{"en": "Add an `if` statement to return the `orodha` if its length is 1 or less.", "sw": "Ongeza sentensi ya `kama` ili kurudisha `orodha` ikiwa urefu wake ni 1 au chini ya hapo."}', 'fanya panga = unda(orodha) {
    kama (orodha.idadi() <= 1) {
        
    }
    rudisha orodha
}

andika(panga([10]))
', 'fanya panga = unda(orodha) {
    kama (orodha.idadi() <= 1) {
        rudisha orodha
    }
    rudisha orodha
}

andika(panga([10]))
', '[{"id": "sorting_conquer_output", "type": "match_output", "message": "The function must return the list of one item as-is. / Kazi lazima irudishe orodha yenye kitu kimoja kama ilivyo.", "pattern": "\\[\\s*10\\s*\\]", "isPublic": true}, {"id": "sorting_conquer_code", "type": "match_code", "message": "You must return the list when its length is 1 or less. / Lazima urudishe orodha wakati idadi yake ni 1 au chini yake.", "pattern": "kama\\s*\\(\\s*orodha\\s*\\.\\s*idadi\\s*\\(\\s*\\)\\s*<=\\s*1\\s*\\)\\s*\\{\\s*(?:[^\\{\\}]*?\\s+)?rudisha\\s+orodha", "isPublic": true}]', 2, '2026-05-20 00:59:53.887086+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('d8921924-016a-448e-ac7d-10cf1ad53e80', 'f8d93c6d-184b-47c4-811a-ee1f310ddf31', 'backtracking', '{"en": "4. Backtracking (The Guess)", "sw": "4. Backtracking (Kisia na Urudi)"}', '{"en": "**Backtracking** is like exploring a maze. \n1. You reach a fork in the road and make a guess.\n2. If you hit a dead end, you **backtrack** to the last fork and try the other path.\n\nIn Sudoku, if we place a `4` but later find out it''s impossible to finish the puzzle, we must remove the `4` (set it back to `0`) and try a different number.\n\n**Your Task:** This is the most important line in backtracking. If the recursive call `tatua()` fails, we must undo our guess. Set `gridi[r][c] = 0` so we can try the next number in the loop.\n\n```nuru\n+++gridi[r][c] = 0+++\n```", "sw": "**Backtracking** ni kama kuchunguza njia zenye kutatanisha.\n1. Unafika kwenye njia panda na unafanya kisia.\n2. Ukigonga ukuta, **unarudi nyuma** (backtrack) hadi kwenye njia panda ya mwisho na unajaribu njia nyingine.\n\nKatika Sudoku, ikiwa tunaweka `4` lakini baadaye tukagundua kuwa haiwezekani kumaliza fumbo, lazima tuondoe `4` (tuiweke tena kuwa `0`) na tujaribu namba tofauti.\n\n**Kazi Yako:** Huu ni mstari muhimu zaidi katika backtracking. Ikiwa wito wa kujirudia `tatua()` utashindwa, lazima tusemue kisia letu. Weka `gridi[r][c] = 0` ili tuweze kujaribu namba inayofuata kwenye kitanzi.\n\n```nuru\n+++gridi[r][c] = 0+++\n```"}', '{"en": "Complete the backtracking step. If `tatua()` returns `sikweli`, reset the cell back to `0`.", "sw": "Kamilisha hatua ya backtracking. Ikiwa `tatua()` inarudisha `sikweli`, rudisha kisanduku kuwa `0`."}', '// Concept code - don''t worry about errors yet!
fanya tatua = unda() {
    fanya nafasi = pata_tupu()
    kama (nafasi == tupu) { rudisha kweli } // Puzzle solved!

    fanya r = nafasi[0]
    fanya c = nafasi[1]

    kwa n ktk mfululizo(1, 5) {
        kama (ni_salama(r, c, n)) {
            gridi[r][c] = n // 1. Make a guess

            kama (tatua()) { rudisha kweli } // 2. Recursively try to solve the rest

            // 3. OH NO! This guess didn''t work.
            // We need to ''Backtrack'' and try the next number.
            // Reset gridi[r][c] to 0 here!
        }
    }
    rudisha sikweli // No number works here, go back to previous call
}
', '// gridi[r][c] = 0
', '[{"id": "sudoku_backtracking_code", "type": "match_code", "message": "You must reset gridi[r][c] to 0 to backtrack when a path fails / Lazima urudishe gridi[r][c] kuwa 0 kufanya backtrack wakati njia inapofeli", "pattern": "gridi\\s*\\[\\s*r\\s*\\]\\s*\\[\\s*c\\s*\\]\\s*=\\s*0", "isPublic": true}]', 3, '2026-05-20 00:59:54.627046+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('e908df8f-c751-4578-b024-5a942e35a7c1', 'f8d93c6d-184b-47c4-811a-ee1f310ddf31', 'validation', '{"en": "2. Is it Safe? (Validation)", "sw": "2. Je, ni Salama? (Uthibitisho)"}', '{"en": "Before placing a number, we must check if it''s allowed. \n\nA placement is **Safe** if that number does not already appear in that row or column. (For this 4x4 example, we''ll keep it simple and just check rows and columns).\n\n**Your Task:** Complete the column check. Loop through all 4 rows at the given `safu` index. If the number is already there, return `sikweli` (false).\n\n```nuru\n+++kama (gridi[i][safu] == namba) { rudisha sikweli }+++\n```", "sw": "Kabla ya kuweka namba, lazima tuangalie ikiwa inaruhusiwa.\n\nUwekaji ni **Salama** ikiwa namba hiyo haipo tayari kwenye mstari au safu hiyo. (Kwa mfano huu wa 4x4, tutafanya mambo kuwa rahisi na kuangalia mistari na safu tu).\n\n**Kazi Yako:** Kamilisha ukaguzi wa safu (column check). Pitia mistari yote 4 kwenye namba ya `safu` iliyotolewa. Ikiwa namba tayari ipo, rudisha `sikweli`.\n\n```nuru\n+++kama (gridi[i][safu] == namba) { rudisha sikweli }+++\n```"}', '{"en": "Complete the `ni_salama` function. Check if `namba` already exists in the given `safu` (column).", "sw": "Kamilisha kitendakazi cha `ni_salama`. Angalia ikiwa `namba` tayari ipo kwenye `safu` iliyotolewa."}', 'fanya gridi = [
  [1, 0, 3, 0],
  [0, 0, 2, 1],
  [0, 1, 0, 2],
  [2, 4, 0, 3]
]

fanya ni_salama = unda(mstari, safu, namba) {
    // 1. Check Row
    kwa i ktk mfululizo(4) {
        kama (gridi[mstari][i] == namba) { rudisha sikweli }
    }

    // 2. Check Column
    kwa i ktk mfululizo(4) {
        // Add your logic here!
        // kama (gridi[i][safu] == namba) { ? }
    }

    rudisha kweli
}

andika("Can we put 4 in [0,1]?", ni_salama(0, 1, 4)) // Should be kweli
andika("Can we put 1 in [0,1]?", ni_salama(0, 1, 1)) // Should be sikweli (Row has 1)
', 'fanya gridi = [
  [1, 0, 3, 0],
  [0, 0, 2, 1],
  [0, 1, 0, 2],
  [2, 4, 0, 3]
]

fanya ni_salama = unda(mstari, safu, namba) {
    kwa i ktk mfululizo(4) {
        kama (gridi[mstari][i] == namba) { rudisha sikweli }
    }
    kwa i ktk mfululizo(4) {
        kama (gridi[i][safu] == namba) { rudisha sikweli }
    }
    rudisha kweli
}

andika("Can we put 4 in [0,1]?", ni_salama(0, 1, 4))
andika("Can we put 1 in [0,1]?", ni_salama(0, 1, 1))
', '[{"id": "sudoku_validation_output", "type": "match_output", "flags": "i", "message": "Check if your ni_salama function returns kweli when safe and sikweli when column has duplicates / Angalia ikiwa kazi yako ya ni_salama inarudisha kweli inapokuwa salama na sikweli wakati safu ina namba inayojirudia", "pattern": "Can we put 4 in \\[0,1\\]\\?\\s*kweli\\s*\\n*Can we put 1 in \\[0,1\\]\\?\\s*sikweli", "isPublic": true}, {"id": "sudoku_validation_code", "type": "match_code", "message": "You must check the column cells using gridi[i][safu] == namba / Lazima uangalie visanduku vya safu ukitumia gridi[i][safu] == namba", "pattern": "gridi\\s*\\[\\s*\\w+\\s*\\]\\s*\\[\\s*safu\\s*\\]\\s*==\\s*namba", "isPublic": true}]', 1, '2026-05-20 00:59:54.448032+00');
INSERT INTO public.lessons (id, module_id, slug, title, description, task, default_code, solution, tests, "order", created_at) VALUES ('f61a996f-4828-46be-8f3a-38dded4773cf', 'f8d93c6d-184b-47c4-811a-ee1f310ddf31', 'empty-cells', '{"en": "3. Finding the Next Spot", "sw": "3. Kutafuta Nafasi Inayofuata"}', '{"en": "To solve Sudoku, we need a way to look for work. \n\nWe scan the grid from top-to-bottom, left-to-right, until we find a `0`. This is the cell we will try to fill next.\n\n### Why return `tupu`?\nIf `pata_tupu()` returns `tupu`, it means there are no more zeros left in the grid. That means **the puzzle is solved!**\n\n**Your Task:** Complete the function to find the next empty cell (0). Return its `[row, col]` coordinates.\n\n```nuru\nkama (gridi[r][c] == 0) {\n    +++rudisha [r, c]+++\n}\n```", "sw": "Ili kutatua Sudoku, tunahitaji njia ya kutafuta kazi ya kufanya.\n\nTunakagua gridi kuanzia juu kwenda chini, kushoto kwenda kulia, hadi tupate `0`. Hiki ndicho kisanduku tutakachojaribu kujaza baadaye.\n\n### Kwa nini turudishe `tupu`?\nIkiwa `pata_tupu()` inarudisha `tupu`, inamaanisha hakuna sifuri zilizobaki kwenye gridi. Hiyo inamaanisha **fumbo limetatuliwa!**\n\n**Kazi Yako:** Kamilisha kitendakazi cha kutafuta kisanduku kinachofuata kilicho wazi (0). Rudisha viwianishi vyake vya `[row, col]`.\n\n```nuru\nkama (gridi[r][c] == 0) {\n    +++rudisha [r, c]+++\n}\n```"}', '{"en": "Complete the function to find the next empty cell (0). Return its `[row, col]` coordinates.", "sw": "Kamilisha kitendakazi cha kutafuta kisanduku kinachofuata kilicho wazi (0). Rudisha viwianishi vyake vya `[row, col]`."}', 'fanya gridi = [
  [1, 0, 3, 0],
  [0, 0, 2, 1],
  [0, 1, 0, 2],
  [2, 4, 0, 3]
]

fanya pata_tupu = unda() {
    kwa r ktk mfululizo(4) {
        kwa c ktk mfululizo(4) {
            kama (gridi[r][c] == 0) {
                // Rudiasha r na c hapa kama orodha [r, c]
            }
        }
    }
    rudisha tupu // No more empty cells!
}

fanya nafasi = pata_tupu()
andika("Next empty cell is at:", nafasi) // Should be [0, 1]
', 'fanya pata_tupu = unda() {
    kwa r ktk mfululizo(4) {
        kwa c ktk mfululizo(4) {
            kama (gridi[r][c] == 0) {
                rudisha [r, c]
            }
        }
    }
    rudisha tupu
}
', '[{"id": "sudoku_empty_cells_output", "type": "match_output", "flags": "i", "message": "The first empty cell should be at [0, 1] / Visanduku tupu vya kwanza vinapaswa kuwa kwenye [0, 1]", "pattern": "Next empty cell is at:(\\s)*\\[0, 1\\]", "isPublic": true}, {"id": "sudoku_empty_cells_code", "type": "match_code", "message": "Ensure you return the coordinates as a list [r, c] / Hakikisha unarudisha majira kama orodha [r, c]", "pattern": "rudisha\\s*\\[\\s*\\w+\\s*,\\s*\\w+\\s*\\]", "isPublic": true}]', 2, '2026-05-20 00:59:54.537408+00');


--
-- PostgreSQL database dump complete
--

\unrestrict B05sGtNHS7X8P34cCV0GHcEc7Lf3iUq4s0jyzq18T5YT52jcQBv7kvSU4oAYJdM

