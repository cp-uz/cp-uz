from ..models import ReviewRecord


def latest_stage_reviews(records):
    latest = {}
    for record in records:
        previous = latest.get(record.stage)
        if previous is None or (record.created_at, record.pk) > (previous.created_at, previous.pk):
            latest[record.stage] = record
    return latest


def approved_review_stages(proposal):
    records = ReviewRecord.objects.filter(proposal=proposal, content_hash=proposal.proposal_hash)
    return {
        stage
        for stage, record in latest_stage_reviews(records).items()
        if record.decision == ReviewRecord.Decision.APPROVED
    }
