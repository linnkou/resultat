def get_grade_comment(grade, grade_comments):
    if grade < 10:
        return grade_comments[0]
    elif grade < 12:
        return grade_comments[1]
    elif grade < 14:
        return grade_comments[2]
    elif grade < 16:
        return grade_comments[3]
    elif grade < 18:
        return grade_comments[4]
    else:
        return grade_comments[5]