FROM eldesh/smlnj@sha256:15e949c1041a735410a86146838a16aed411419734da26077451635071c9aea9 AS sml
FROM debian:bookworm-slim@sha256:734a72b3d6142a71993b4bc580ca01d8ca687f77a2c422d96a961d3376b179bc
RUN apt-get update && apt-get install -y --no-install-recommends make gcc ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY --from=sml /smlnj/smlnj /smlnj/smlnj
ENV PATH="/smlnj/smlnj/bin:${PATH}"
COPY autograde.tar /opt/hw09/autograde.tar
COPY run_autograder /usr/local/bin/run_autograder
RUN chmod 0555 /usr/local/bin/run_autograder && chmod 0444 /opt/hw09/autograde.tar \
    && mkdir -p /autograder/submission
USER 65534:65534
WORKDIR /work
CMD ["/usr/local/bin/run_autograder"]
