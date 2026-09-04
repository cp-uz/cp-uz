#include "gnomes.h"
#include <cstdio>
#include <stdio.h>
#include <cassert>
#include <algorithm>
#include <random>

FILE *logfile;
void fprintf_array(std::vector<int> arr){
    fprintf(logfile, "[");
    for (int i = 0; i < (int) arr.size(); i++){
        if (i > 0) fprintf(logfile, ", ");
        fprintf(logfile, "%d", arr[i]);
    }
    fprintf(logfile, "]");
}

int main(){
    logfile = fopen("log.txt", "w");

    int n, k, h, t;
    assert(4 == scanf("%d %d %d %d", &n, &k, &h, &t));

    std::vector<std::vector<int>> p(t);
    for (int s = 0; s < t; s++){
        p[s].resize(n);
        for (int i = 0; i < n; i++){
            assert(1 == scanf("%d", &p[s][i]));
        }
    }

    fprintf(logfile, "First run, initialization. \n");
    fprintf(logfile, "init(%d, %d, %d)\n\n", n, k, h);
    init(n, k, h);

    fprintf(logfile, "Second run, getting all numbers.\n");

    int m = 0;
    std::vector<std::vector<int>> numbers(t);
    for (int s = 0; s < t; s++){
        for (int i = 0; i < n; i++){
            std::vector<int> a = p[s];
            a.erase(a.begin() + i);

            int x = say_number(i, a);
            m = std::max(m, x);
            numbers[s].push_back(x);

            fprintf(logfile, "scenario #%d. say_number(%d, ", s, i);
            fprintf_array(a);
            fprintf(logfile, ") returned %d\n", x);
        }
    }

    fprintf(logfile, "\nThird run, getting answers.\n");

    std::vector<std::pair<int, int>> order;
    for (int s = 0; s < t; s++){
        for (int i = 0; i < n; i++){
            order.emplace_back(s, i);
        }
    }
    std::shuffle(order.begin(), order.end(), std::mt19937(58));

    std::vector<std::vector<int>> answers(t, std::vector<int>(n, -1));
    for (int it = 0; it < n * t; it++){
        int s = order[it].first, i = order[it].second;

        std::vector<int> a = p[s];
        a.erase(a.begin() + i);

        int r = answer(i, a, numbers[s]);
        answers[s][i] = r;

        fprintf(logfile, "scenario #%d. answer(%d, ", s, i);
        fprintf_array(a);
        fprintf(logfile, ", ");
        fprintf_array(numbers[s]);
        fprintf(logfile, ") returned %d\n", r);

    }

    /** Printing answers */
    printf("%d\n", m);
    for (int s = 0; s < t; s++){
        for (int i = 0; i < n; i++){
            printf("%d ", answers[s][i]);
        }
        printf("\n");
    }

    return 0;
}
