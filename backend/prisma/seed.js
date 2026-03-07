import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const ADMIN_EMAIL = "admin@codeforge.dev";
const ADMIN_PASSWORD = "Admin@CodeForge123";

async function ensureAdmin() {
  let user = await db.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!user) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    user = await db.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: "CodeForge Admin",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("Created admin user:", user.email);
  } else {
    console.log("Admin user already exists:", user.email);
  }
  return user.id;
}

const problems = [
  // --- 1. MEDIUM ---
  {
    title: "Longest Substring Without Repeating Characters",
    description: `Given a string s, find the length of the longest substring without repeating characters.

Example 1:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.`,
    difficulty: "MEDIUM",
    tags: ["Hash Table", "String", "Sliding Window"],
    constraints: "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
    hints: "Use a sliding window with a set or map to track characters in the current window.",
    editorial: "Maintain a window [i, j] and a set of characters in the window. If s[j] is already in the set, move i until the duplicate is removed. Update max length at each step.",
    testcases: [
      { input: "abcabcbb", output: "3" },
      { input: "bbbbb", output: "1" },
      { input: "pwwkew", output: "3" },
      { input: " ", output: "1" },
      { input: "dvdf", output: "3" },
    ],
    examples: {
      JAVASCRIPT: { input: 's = "abcabcbb"', output: "3", explanation: "Longest substring is \"abc\"." },
      PYTHON: { input: 's = "abcabcbb"', output: "3", explanation: "Longest substring is \"abc\"." },
      JAVA: { input: 's = "abcabcbb"', output: "3", explanation: "Longest substring is \"abc\"." },
    },
    codeSnippets: {
      JAVASCRIPT: `function lengthOfLongestSubstring(s) {
  // Write your code here
  return 0;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
rl.on('line', (line) => {
  const result = lengthOfLongestSubstring(line.trim());
  console.log(result);
  rl.close();
});`,
      PYTHON: `def length_of_longest_substring(s: str) -> int:
    # Write your code here
    return 0

if __name__ == "__main__":
    s = input().strip()
    print(length_of_longest_substring(s))`,
      JAVA: `import java.util.Scanner;

public class Main {
    public static int lengthOfLongestSubstring(String s) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(lengthOfLongestSubstring(s));
        sc.close();
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `function lengthOfLongestSubstring(s) {
  const set = new Set();
  let i = 0, max = 0;
  for (let j = 0; j < s.length; j++) {
    while (set.has(s[j])) set.delete(s[i++]);
    set.add(s[j]);
    max = Math.max(max, j - i + 1);
  }
  return max;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
rl.on('line', (line) => {
  console.log(lengthOfLongestSubstring(line.trim()));
  rl.close();
});`,
      PYTHON: `def length_of_longest_substring(s: str) -> int:
    seen = {}
    i = max_len = 0
    for j, c in enumerate(s):
        if c in seen and seen[c] >= i:
            i = seen[c] + 1
        seen[c] = j
        max_len = max(max_len, j - i + 1)
    return max_len

if __name__ == "__main__":
    s = input().strip()
    print(length_of_longest_substring(s))`,
      JAVA: `import java.util.Scanner;
import java.util.HashMap;

public class Main {
    public static int lengthOfLongestSubstring(String s) {
        var map = new HashMap<Character, Integer>();
        int i = 0, max = 0;
        for (int j = 0; j < s.length(); j++) {
            char c = s.charAt(j);
            if (map.containsKey(c) && map.get(c) >= i)
                i = map.get(c) + 1;
            map.put(c, j);
            max = Math.max(max, j - i + 1);
        }
        return max;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().trim();
        System.out.println(lengthOfLongestSubstring(s));
        sc.close();
    }
}`,
    },
  },
  // --- 2. HARD ---
  {
    title: "Merge k Sorted Lists",
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

Example 1:
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: The linked-lists are [1->4->5], [1->3->4], [2->6]. Merging them into one sorted list: 1->1->2->3->4->4->5->6.

Example 2:
Input: lists = []
Output: []

Example 3:
Input: lists = [[]]
Output: []

For this problem, we simplify: you will receive k lines. Each line contains a sorted list of integers separated by spaces. Output a single line with all integers merged and sorted.`,
    difficulty: "HARD",
    tags: ["Linked List", "Divide and Conquer", "Heap"],
    constraints: "k == lists.length\n0 <= k <= 10^4\n0 <= lists[i].length <= 500\n-10^4 <= lists[i][j] <= 10^4\nEach list is sorted in ascending order.",
    hints: "Use a min-heap to always pick the smallest element across all lists, or merge lists in pairs (divide and conquer).",
    editorial: "Approach 1: Put the first node of each list in a min-heap. Repeatedly pop the smallest, append to result, and push its next. Approach 2: Merge lists two at a time until one remains.",
    testcases: [
      { input: "1 4 5\n1 3 4\n2 6", output: "1 1 2 3 4 4 5 6" },
      { input: "", output: "" },
      { input: "1\n2\n3", output: "1 2 3" },
    ],
    examples: {
      JAVASCRIPT: { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]", explanation: "Merge and sort." },
      PYTHON: { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]", explanation: "Merge and sort." },
      JAVA: { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]", explanation: "Merge and sort." },
    },
    codeSnippets: {
      JAVASCRIPT: `function mergeKLists(lines) {
  // lines: array of strings, each string is space-separated integers
  // Return space-separated merged sorted integers
  return "";
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
const lines = [];
rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
  const result = mergeKLists(lines.filter(l => l.trim()));
  console.log(result);
});`,
      PYTHON: `def merge_k_lists(lines):
    # lines: list of strings (space-separated integers)
    # Return space-separated merged sorted integers
    return ""

import sys
lines = [l.strip() for l in sys.stdin.readlines() if l.strip()]
print(merge_k_lists(lines))`,
      JAVA: `import java.util.*;

public class Main {
    public static String mergeKLists(String[] lines) {
        // Return space-separated merged sorted integers
        return "";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> lines = new ArrayList<>();
        while (sc.hasNextLine()) lines.add(sc.nextLine().trim());
        lines.removeIf(s -> s.isEmpty());
        System.out.println(mergeKLists(lines.toArray(new String[0])));
        sc.close();
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `function mergeKLists(lines) {
  const arr = [];
  for (const line of lines) {
    for (const x of line.trim().split(/\\s+/)) arr.push(parseInt(x, 10));
  }
  arr.sort((a, b) => a - b);
  return arr.join(' ');
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
const lines = [];
rl.on('line', (line) => lines.push(line));
rl.on('close', () => {
  const result = mergeKLists(lines.filter(l => l.trim()));
  console.log(result);
});`,
      PYTHON: `def merge_k_lists(lines):
    arr = []
    for line in lines:
        arr.extend(map(int, line.split()))
    arr.sort()
    return ' '.join(map(str, arr))

import sys
lines = [l.strip() for l in sys.stdin.readlines() if l.strip()]
print(merge_k_lists(lines))`,
      JAVA: `import java.util.*;

public class Main {
    public static String mergeKLists(String[] lines) {
        List<Integer> list = new ArrayList<>();
        for (String line : lines) {
            for (String s : line.trim().split("\\\\s+")) {
                if (!s.isEmpty()) list.add(Integer.parseInt(s));
            }
        }
        Collections.sort(list);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(' ');
            sb.append(list.get(i));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> lines = new ArrayList<>();
        while (sc.hasNextLine()) lines.add(sc.nextLine().trim());
        lines.removeIf(s -> s.isEmpty());
        System.out.println(mergeKLists(lines.toArray(new String[0])));
        sc.close();
    }
}`,
    },
  },
  // --- 3. HARD ---
  {
    title: "Trapping Rain Water",
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

Example 1:
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.

Example 2:
Input: height = [4,2,0,3,2,5]
Output: 9

You will receive a single line of space-separated integers (the elevation array). Output one integer: the total trapped water.`,
    difficulty: "HARD",
    tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    constraints: "n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5",
    hints: "For each index, the water level is min(max_left, max_right) - height[i]. Use two pointers or precompute prefix max arrays.",
    editorial: "Two pointers: maintain left_max and right_max. Move the pointer with the smaller max; water at current index is min(left_max, right_max) - height[i].",
    testcases: [
      { input: "0 1 0 2 1 0 1 3 2 1 2 1", output: "6" },
      { input: "4 2 0 3 2 5", output: "9" },
      { input: "1 0 1", output: "1" },
      { input: "5 4 3 2 1", output: "0" },
    ],
    examples: {
      JAVASCRIPT: { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "6 units trapped." },
      PYTHON: { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "6 units trapped." },
      JAVA: { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "6 units trapped." },
    },
    codeSnippets: {
      JAVASCRIPT: `function trap(height) {
  // Write your code here
  return 0;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
rl.on('line', (line) => {
  const height = line.trim().split(/\\s+/).map(Number);
  console.log(trap(height));
  rl.close();
});`,
      PYTHON: `def trap(height):
    # Write your code here
    return 0

if __name__ == "__main__":
    height = list(map(int, input().strip().split()))
    print(trap(height))`,
      JAVA: `import java.util.*;

public class Main {
    public static int trap(int[] height) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split("\\\\s+");
        int[] height = new int[parts.length];
        for (int i = 0; i < parts.length; i++) height[i] = Integer.parseInt(parts[i]);
        System.out.println(trap(height));
        sc.close();
    }
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `function trap(height) {
  let l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
  while (l < r) {
    if (height[l] <= height[r]) {
      if (height[l] >= leftMax) leftMax = height[l];
      else water += leftMax - height[l];
      l++;
    } else {
      if (height[r] >= rightMax) rightMax = height[r];
      else water += rightMax - height[r];
      r--;
    }
  }
  return water;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
rl.on('line', (line) => {
  const height = line.trim().split(/\\s+/).map(Number);
  console.log(trap(height));
  rl.close();
});`,
      PYTHON: `def trap(height):
    l, r = 0, len(height) - 1
    left_max = right_max = water = 0
    while l < r:
        if height[l] <= height[r]:
            if height[l] >= left_max:
                left_max = height[l]
            else:
                water += left_max - height[l]
            l += 1
        else:
            if height[r] >= right_max:
                right_max = height[r]
            else:
                water += right_max - height[r]
            r -= 1
    return water

if __name__ == "__main__":
    height = list(map(int, input().strip().split()))
    print(trap(height))`,
      JAVA: `import java.util.*;

public class Main {
    public static int trap(int[] height) {
        int l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
        while (l < r) {
            if (height[l] <= height[r]) {
                if (height[l] >= leftMax) leftMax = height[l];
                else water += leftMax - height[l];
                l++;
            } else {
                if (height[r] >= rightMax) rightMax = height[r];
                else water += rightMax - height[r];
                r--;
            }
        }
        return water;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split("\\\\s+");
        int[] height = new int[parts.length];
        for (int i = 0; i < parts.length; i++) height[i] = Integer.parseInt(parts[i]);
        System.out.println(trap(height));
        sc.close();
    }
}`,
    },
  },
];

async function main() {
  console.log("Seeding database...");
  const userId = await ensureAdmin();

  for (const p of problems) {
    const existing = await db.problem.findFirst({
      where: { title: p.title },
    });
    if (existing) {
      console.log("Problem already exists:", p.title);
      continue;
    }
    await db.problem.create({
      data: {
        ...p,
        userId,
      },
    });
    console.log("Created problem:", p.title, "(" + p.difficulty + ")");
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
